import type { ComponentType } from "react";
import { AboutApp } from "@/components/apps/AboutApp";
import { ProjectsApp } from "@/components/apps/ProjectsApp";
import { ResumeApp } from "@/components/apps/ResumeApp";
import { TerminalApp } from "@/components/apps/TerminalApp";

export const APP_COMPONENTS: Record<string, ComponentType> = {
  about: AboutApp,
  projects: ProjectsApp,
  terminal: TerminalApp,
  resume: ResumeApp,
};
