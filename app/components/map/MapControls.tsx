import { Layers, LocateFixed, Minus, Plus } from "lucide-react";

export function MapControls(){
    return(
        <div aria-hidden className="fixed right-5 bottom-6 z-40 hidden flex-col items-end gap-3 lg:flex">
            <div className="glass grid size-11 place-items-center rounded-2xl text-ink-soft">
                <Layers className="size-5" />
            </div>
            <div className="glass grid size-11 place-items-center rounded-full text-gmap-blue">
                <LocateFixed className="size-5" />
            </div>
            <div className="glass flex w-11 flex-col items-center overflow-hidden rounded-2xl text-ink-soft">
                <span className="grid h-11 w-full place-items-center"><Plus className="size-5" /></span>
                <span className="h-px w-6 bg-black/10" />
                <span className="grid h-11 w-full place-items-center"><Minus className="size-5" /></span>
            </div>
        </div>
    );
}