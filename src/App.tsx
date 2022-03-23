import { Component, createSignal, Index } from "solid-js";
import store, { getRowCells, updateCellLabel, updateColumnLabel } from "./store";
import { InputField, inputValue, setInputValue } from "./core/🌍InputField";

const emptyRenamingState = {
	x: -1,
	y: -1,
	inisialText: "",
	placeholder: "",
	dimensions: {
		width: 40,
		height: 10,
		posX: 10,
		posY: 10,
	},
};

const [renamingState, setRenameState] = createSignal<{
	x: number;
	inisialText: string;
	y: number;
	placeholder: string;
	dimensions: {
		width: number;
		height: number;
		posX: number;
		posY: number;
	};
}>(emptyRenamingState);

export const RenamingHandler = (
	el: HTMLButtonElement | null,
	details: {
		x: number;
		y?: number;
		inisialText?: string;
		placeholder?: string;
	}
) => {
	let values: DOMRect;
	if (el !== null) {
		values = el.getBoundingClientRect();
	} else if (details.y) {
		// id={`cell-${x + 1}-${y + 1}`}
		values = document.getElementById(`cell-${details.x + 1}-${details.y + 1}`)?.getBoundingClientRect() || new DOMRect();
	} else {
		values = document.getElementById(`header-${details.x + 1}`)?.getBoundingClientRect() || new DOMRect();
	}
	const { width, height, x, y } = values;
	console.log(details.placeholder);
	setRenameState({
		x: details.x,
		y: details.y || -1,
		inisialText: details.inisialText || el?.innerText || "",
		placeholder: details.placeholder || "",
		dimensions: {
			width,
			height,
			posX: x,
			posY: y,
		},
	});
};

const App: Component = () => {
	return (
		<main class="min-h-screen flex flex-col items-center justify-center bg-slate-900">
			{renamingState().x !== -1 ? (
				<InputField
					placeholder={renamingState().placeholder || "rename"}
					onDone={() => {
						const { x, y } = renamingState();
						if (y !== -1) {
							updateCellLabel(x, y, inputValue());
						} else updateColumnLabel(x, inputValue());
						setRenameState(emptyRenamingState);
					}}
					ref={(el) => {
						const { inisialText, dimensions } = renamingState();
						setInputValue(inisialText);
						// @ts-ignore
						el.parentElement.style.top = `${dimensions.posY}px`;
						// @ts-ignore
						el.parentElement.style.left = `${dimensions.posX}px`;
						// @ts-ignore
						el.parentElement.style.width = `${dimensions.width}px`;
						// @ts-ignore It's defined
						el.parentElement.style.height = `${dimensions.height}px`;
					}}
				/>
			) : null}
			<section class="max-w-4xl w-full h-96 flex items-center justify-center">
				<div id="table" class="flex w-max p-2">
					<Index each={store.table.columns}>
						{(column, x) => {
							let isFirst = x === 0;
							return (
								<div id={`column-${x + 1}`} class="bg-white group flex flex-col w-max border-slate-700">
									<button
										id={`header-${x + 1}`}
										class="bg-slate-400 group-hover:bg-slate-500 hover:!bg-slate-600 px-3 py-1 border-slate-600 border-b text-left"
										classList={{ "border-l": !isFirst }}
										onClick={(el) => {
											RenamingHandler(el.currentTarget, {
												x: x + 1,
											});
										}}>
										<span class="text-white uppercase">{column().label}</span>
									</button>
									<div
										id={`cells-${x + 1}`}
										class="bg-slate-300 group-hover:bg-slate-400 border-slate-600 flex flex-col items-start"
										classList={{ "border-l": !isFirst }}
									>
										<Index each={column().cells}>
											{(cell, y) => {
												let isFirst = y === 0;
												return (
													<button
														id={`cell-${x + 1}-${y + 1}`}
														class="hover:bg-slate-100 text-slate-900 hover:text-slate-900 px-3 py-1 border-slate-600 w-full text-left"
														classList={{ "border-t": !isFirst }}
														onClick={(el) => {
															RenamingHandler(el.currentTarget, {
																x: x + 1,
																y: y + 1,
															});
														}}
														onMouseEnter={(el)=>{
															getRowCells({
																y:y+1,
																fromX:'left',
																toX:'right'
															}).forEach((cell)=>{
																if(document.getElementById(`cell-${cell.x}-${cell.y}`)!==el.currentTarget){
																	document.getElementById(`cell-${cell.x}-${cell.y}`)?.classList.add('bg-slate-400')
																}
															})
														}}
														onMouseLeave={(el)=>{
															getRowCells({
																y:y+1,
																fromX:'left',
																toX:'right'
															}).forEach((cell)=>{
																if(document.getElementById(`cell-${cell.x}-${cell.y}`)!==el.currentTarget){
																	document.getElementById(`cell-${cell.x}-${cell.y}`)?.classList.remove('bg-slate-400')
																}
															})
														}}
														>
														<span class="">{cell().label}</span>
													</button>
												);
											}}
										</Index>
									</div>
								</div>
							);
						}}
					</Index>
				</div>
			</section>
		</main>
	);
};

export default App;
