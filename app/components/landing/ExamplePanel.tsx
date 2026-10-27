import { Panel } from "@/app/components/ui/Panel";
import { ItineraryTabs } from "./ItineraryTabs";

export function ExamplePanel() {
  return (
    <Panel id="exemplo" title="Exemplo: Lisboa em 3 dias" subtitle="Cada dia agrupado por região, na ordem certa">
      <ItineraryTabs />
    </Panel>
  );
}