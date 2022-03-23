import { ComponentProps, createSignal,splitProps, PropsWithChildren, onMount, onCleanup } from "solid-js";
import { InsertBeforeApp } from "./InsertBefore";

// want to write it's name'🌍
export const [inputValue, setInputValue] = createSignal("");

type InputProps<P = {}> = P & {
	placeholder?: string;
	onDone:() => void;
	onClose?: () => void;
}

export const InputField = (props: InputProps<PropsWithChildren<ComponentProps<'input'>>> ) => {
	const [local,other] = splitProps(props,['onDone','onClose','placeholder']);
	let inputRef: HTMLInputElement;
	let keyDownHandler = (e:KeyboardEvent)=>{
			// if(document.activeElement !== inputRef) local.onDone();
			if(e.key === 'Enter') local.onDone();
		};
	onMount(()=>{
		inputRef.focus();
		window.addEventListener('keydown',keyDownHandler);
		inputRef.onblur = () => {
			local.onDone()
		}
		onCleanup(()=>{
			// console.log("I am removed");
			window.removeEventListener('keydown',keyDownHandler);
		})
	})
	return (
		<InsertBeforeApp>
			<div class="absolute z-10 flex items-center justify-end bg-slate-800">
				<input
					// class="bg-transparent text-slate-800 focus:outline-none focus:bg-white focus:scale-105 focus:-translate-x-1 rounded-l-lg pl-1"
					class="w-full bg-transparent placeholder:text-slate-500 text-white focus:outline-none pl-1"
					placeholder={local.placeholder||"rename"}
					type="text"
					ref={(el) => {
						inputRef = el;
						// @ts-ignore
						props.ref(el);
					}}
					onInput={(e) => {
						setInputValue(e.currentTarget.value);
					}}
					value={inputValue()}
				/>
			</div>
		</InsertBeforeApp>
	);
};
