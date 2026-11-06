"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import { Euler, MathUtils, PerspectiveCamera, Quaternion, Vector3, type Group } from "three";
import { SPHERE_RADIUS, type PositionedSpiralNode } from "@/lib/spiral-layout";

interface SphereRigProps {
  focusNode: PositionedSpiralNode | null;
  tight: boolean;
  compact: boolean;
  children: ReactNode;
}

/** 1 is the pulled-back planet. 0 is the center. Negative keeps moving toward the card ahead. */
const OUTSIDE_DISTANCE = 24;
const REST_ZOOM = 0.875;
const INNER_ZOOM = 0.62;
const CLOSE_CLEARANCE = 1.8;
const DRAG_YAW = 0.0046;
const DRAG_PITCH = 0.0036;

const userEuler = new Euler(0, 0, 0, "YXZ");
const userQuaternion = new Quaternion();
const alignQuaternion = new Quaternion();
const goalQuaternion = new Quaternion();
const outward = new Vector3();
const front = new Vector3(0, 0, -1);

export function SphereRig({ focusNode, tight, compact, children }: SphereRigProps) {
  const groupRef = useRef<Group>(null);
  const yaw = useRef(0.2);
  const pitch = useRef(0);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0, t: 0 });
  const current = useRef(new Quaternion());
  const reducedMotion = useRef(false);
  const zoomTarget = useRef(REST_ZOOM);
  const zoom = useRef(REST_ZOOM);
  const spin = useRef({ yaw: 0, pitch: 0 });
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const element = document.getElementById("lp-hex-field");

    if (!element) {
      return;
    }

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      dragging.current = true;
      last.current = { x: event.clientX, y: event.clientY, t: event.timeStamp };
      spin.current.yaw = 0;
      spin.current.pitch = 0;
    };

    const onMove = (event: PointerEvent) => {
      if (!dragging.current) {
        return;
      }

      const dx = event.clientX - last.current.x;
      const dy = event.clientY - last.current.y;
      const dt = Math.max(16, event.timeStamp - last.current.t) / 1000;
      last.current = { x: event.clientX, y: event.clientY, t: event.timeStamp };
      yaw.current -= dx * DRAG_YAW;
      pitch.current = MathUtils.clamp(pitch.current + dy * DRAG_PITCH, -1.15, 1.15);
      spin.current.yaw = (-dx * DRAG_YAW) / dt;
      spin.current.pitch = (dy * DRAG_PITCH) / dt;
    };

    const onUp = () => {
      dragging.current = false;
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const pixels =
        event.deltaMode === 1
          ? event.deltaY * 16
          : event.deltaMode === 2
            ? event.deltaY * window.innerHeight
            : event.deltaY;
      const gain = event.ctrlKey ? 0.008 : 0.0016;
      zoomTarget.current = MathUtils.clamp(zoomTarget.current + pixels * gain, -INNER_ZOOM, 1);
    };

    let pinchDistance = 0;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        pinchDistance = fingerDistance(event);
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 2 || pinchDistance <= 0) {
        return;
      }

      event.preventDefault();
      const next = fingerDistance(event);
      zoomTarget.current = MathUtils.clamp(
        zoomTarget.current + (pinchDistance - next) * 0.0045,
        -INNER_ZOOM,
        1,
      );
      pinchDistance = next;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length < 2) {
        pinchDistance = 0;
      }
    };

    element.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchmove", onTouchMove, { passive: false });
    element.addEventListener("touchend", onTouchEnd);
    element.addEventListener("touchcancel", onTouchEnd);

    return () => {
      element.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
      element.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  useFrame((_, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const reduced = reducedMotion.current;
    const locked = Boolean(focusNode);
    const zoomFollow = reduced ? 1 : 1 - Math.exp(-5.2 * delta);
    zoom.current += (zoomTarget.current - zoom.current) * zoomFollow;
    const approach = MathUtils.clamp(-Math.min(zoom.current, 0) / INNER_ZOOM, 0, 1);
    const distance =
      zoom.current >= 0 ? zoom.current * OUTSIDE_DISTANCE : -approach * (SPHERE_RADIUS - CLOSE_CLEARANCE);
    camera.position.set(0, 0, distance);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, distance - 1);

    if (camera instanceof PerspectiveCamera) {
      const centerFov = compact ? 88 : 78;
      const closeFov = compact ? 52 : 46;
      const outsideFov = compact ? 36 : 32;
      const insideFov = MathUtils.lerp(centerFov, closeFov, approach);
      const nextFov = zoom.current <= 0 ? insideFov : MathUtils.lerp(centerFov, outsideFov, zoom.current);

      if (Math.abs(camera.fov - nextFov) > 0.05) {
        camera.fov = nextFov;
        camera.updateProjectionMatrix();
      }
    }

    if (!dragging.current && !locked && zoom.current > 0.02) {
      if (!reduced) {
        yaw.current += spin.current.yaw * delta;
        pitch.current = MathUtils.clamp(pitch.current + spin.current.pitch * delta, -1.15, 1.15);
        const damp = Math.exp(-2.6 * delta);
        spin.current.yaw *= damp;
        spin.current.pitch *= damp;

        if (Math.hypot(spin.current.yaw, spin.current.pitch) < 0.12) {
          yaw.current += delta * 0.045;
        }
      }
    }

    userEuler.set(pitch.current, yaw.current, 0);
    userQuaternion.setFromEuler(userEuler);

    if (focusNode) {
      outward.set(focusNode.position[0], focusNode.position[1], focusNode.position[2]);

      if (outward.lengthSq() > 1e-6) {
        outward.normalize();
        alignQuaternion.setFromUnitVectors(outward, front);
        goalQuaternion.copy(alignQuaternion);
      } else {
        goalQuaternion.copy(userQuaternion);
      }
    } else {
      goalQuaternion.copy(userQuaternion);

      if (approach > 0.001 && nearestCardLocal(group, userQuaternion, cardLocal)) {
        cardWorld.copy(cardLocal).applyQuaternion(userQuaternion);

        if (cardWorld.lengthSq() > 1e-6) {
          cardWorld.normalize();
          correction.setFromUnitVectors(cardWorld, front);
          correction.slerp(identity, 1 - approach);
          goalQuaternion.premultiply(correction);
        }
      }
    }

    const follow = reduced ? 1 : 1 - Math.exp(-(tight ? 4.4 : 2.6) * delta);
    current.current.slerp(goalQuaternion, follow);
    group.quaternion.copy(current.current);
  });

  return <group ref={groupRef}>{children}</group>;
}

const identity = new Quaternion();
const correction = new Quaternion();
const cardLocal = new Vector3();
const cardWorld = new Vector3();

function nearestCardLocal(group: Group, orientation: Quaternion, out: Vector3) {
  let best = -Infinity;
  let found = false;

  for (const child of group.children) {
    if (child.position.lengthSq() < 1) {
      continue;
    }

    cardWorld.copy(child.position).applyQuaternion(orientation);
    const score = -cardWorld.z;

    if (score > best) {
      best = score;
      out.copy(child.position);
      found = true;
    }
  }

  return found;
}

function fingerDistance(event: TouchEvent) {
  const [a, b] = [event.touches[0], event.touches[1]];
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}
