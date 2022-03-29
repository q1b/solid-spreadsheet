import { ComponentProps, createSignal,splitProps, PropsWithChildren, onMount, onCleanup } from "solid-js";
import { InsertBeforeApp } from "./InsertBefore";

type SelectionDetails = {

}

export const [selectionDetails, setSelectionDetails] = createSignal<SelectionDetails>();

type SelectionBoxProps<P = {}> = P & {

}

export const SelectionBox = (props: SelectionBoxProps<PropsWithChildren<ComponentProps<'button'>>> ) => {
    const [local,other] = splitProps(props,[]);
	let btnRef: HTMLButtonElement;
    return (
		<InsertBeforeApp>
			<div class="absolute z-10 flex items-center justify-end bg-white/40 border-2 border-cyan-400 focus:outline-none">
				<button
					// class="bg-transparent text-slate-800 focus:outline-none focus:bg-white focus:scale-105 focus:-translate-x-1 rounded-l-lg pl-1"
					class="w-full bg-transparent text-white focus:outline-none pl-1"
					ref={(el) => {
						btnRef = el;
						// @ts-ignore
						props.ref(el);
					}}
				></button>
			</div>
		</InsertBeforeApp>
    )
}
