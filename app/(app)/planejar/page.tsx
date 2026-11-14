import type { Metadata } from "next";
import { PlannerPanel } from "@/app/components/planner/PlannerPanel";

export const metadata: Metadata = {
  title: "Planejar viagem — TripMind",
};

export default function PlanejarPage() {
  return <PlannerPanel />;
}