import {
	Component,
	createEffect,
	createSignal,
	Index,
	on,
	onCleanup,
	onMount,
} from "solid-js";
import store, {
	getRowCells,
	updateCellLabel,
	updateColumnLabel,
} from "./store";
import { InputField, inputValue, setInputValue } from "./core/🌍InputField";
import { SelectionBox } from "./core/SelectionBox";

type RectDimension = {
	width: number;
	height: number;
	x: number;
	y: number;
	top: number;
	left: number;
	right: number;
	bottom: number;
};

const getRect = (rect: DOMRect): RectDimension => {
	const values: RectDimension = {} as RectDimension;
	for (const key in rect) {
		if (typeof rect[key] !== "function") {
			values[key] = rect[key];
		}
	}
	return values;
};

const emptyResizerState = {
	initialCell: {
		x: -1,
		y: -1,
	},
	prevCell: {
		x: -1,
		y: -1,
	},
	initialDimensions: {
		top: -1,
		left: -1,
		right: -1,
		bottom: -1,
	},
	prevDimensions: {
		top: -1,
		left: -1,
		right: -1,
		bottom: -1,
	},
};

const [resizerState, setResizerState] = createSignal<{
	initialCell: {
		x: number;
		y: number;
	};
	prevCell: {
		x: number;
		y: number;
	};
	initialDimensions: {
		top: number;
		left: number;
		right: number;
		bottom: number;
	};
	prevDimensions: {
		top: number;
		left: number;
		right: number;
		bottom: number;
	};
}>(emptyResizerState);

export const ResizerHandler = (
	el: HTMLButtonElement | null,
	details: {
		cell: {
			x: number;
			y: number;
		};
	},
) => {
	let values: RectDimension;
	if (el !== null) {
		values = getRect(el.getBoundingClientRect());
	} else {
		// id={`cell-${x + 1}-${y + 1}`}
		values = getRect(
			document
				.getElementById(
					`cell-${details.cell.x + 1}-${details.cell.y + 1}`,
				)
				?.getBoundingClientRect() || new DOMRect(),
		);
	}
	const { top, left, right, bottom } = values;
	const initialCell = () => {
		if (resizerState().initialCell.x !== -1)
			return resizerState().initialCell;
		return {
			x: details.cell.x,
			y: details.cell.y,
		};
	};
	const prevCell = () => {
		if (resizerState().initialDimensions.top === -1)
			return emptyResizerState.prevCell;
		return {
			x: details.cell.x,
			y: details.cell.y,
		};
	};
	const initialDimensions = () => {
		if (resizerState().initialDimensions.top !== -1)
			return resizerState().initialDimensions;
		return {
			top,
			left,
			right,
			bottom,
		};
	};
	const prevDimensions = () => {
		if (resizerState().initialDimensions.top === -1)
			return emptyResizerState.prevDimensions;
		return {
			top,
			left,
			right,
			bottom,
		};
	};
	setResizerState({
		initialCell: initialCell(),
		prevCell: prevCell(),
		initialDimensions: initialDimensions(),
		prevDimensions: prevDimensions(),
	});
	//   console.log(JSON.stringify(resizerState().prevDimensions, null, 2));
};

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
	},
) => {
	let values: DOMRect;
	if (el !== null) {
		values = el.getBoundingClientRect();
	} else if (details.y) {
		// id={`cell-${x + 1}-${y + 1}`}
		values =
			document
				.getElementById(`cell-${details.x + 1}-${details.y + 1}`)
				?.getBoundingClientRect() || new DOMRect();
	} else {
		values =
			document
				.getElementById(`header-${details.x + 1}`)
				?.getBoundingClientRect() || new DOMRect();
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
	const [selectionState, setSelectionState] = createSignal<boolean>(false);
	createEffect(
		on(selectionState, (v, p) => {
			if (!v) {
				setResizerState(emptyResizerState);
			}
		}),
	);
	const handleKeyboardInitEvent = (e:KeyboardEvent) => e.key === "Shift" ? setSelectionState(true) : null;
	const handleKeyboardExitEvent = (e:KeyboardEvent) => e.key === "Shift" ? setSelectionState(false) : null;
	onMount(() => {
		window.addEventListener("keydown",handleKeyboardInitEvent);
		window.addEventListener("keyup",handleKeyboardExitEvent);
		onCleanup(()=>{
			removeEventListener("keydown",handleKeyboardInitEvent);
			removeEventListener("keyup",handleKeyboardExitEvent);
		})
	});
	return (
		<main class="min-h-screen flex flex-col items-center justify-center bg-slate-900">
			{resizerState().initialCell.x !== -1 ? (
				<SelectionBox
					ref={(el) => {
						// @ts-ignore
						const containerElement: HTMLDivElement = el.parentElement;
						const {
							initialDimensions,
							prevCell,
							initialCell,
							prevDimensions,
						} = resizerState();
						if (prevDimensions.top === -1 ) {
							console.log(
								"INISIAL",
								JSON.stringify(initialDimensions, null, 2),
							);
							containerElement.style.top = `${initialDimensions.top}px`;
							containerElement.style.left = `${initialDimensions.left}px`;
							containerElement.style.width = `${
								initialDimensions.right - initialDimensions.left
							}px`;
							containerElement.style.height = `${
								initialDimensions.bottom - initialDimensions.top
							}px`;
						} else if (!selectionState()) {
							console.log(
								"INISIAL",
								JSON.stringify(initialDimensions, null, 2),
							);
							containerElement.style.top = `${prevDimensions.top}px`;
							containerElement.style.left = `${prevDimensions.left}px`;
							containerElement.style.width = `${
								prevDimensions.right - prevDimensions.left
							}px`;
							containerElement.style.height = `${
								prevDimensions.bottom - prevDimensions.top
							}px`;
						} else {
							if ( selectionState() && initialCell.x - prevCell.x <= 0) {
								containerElement.style.left = `${initialDimensions.left}px`;
								containerElement.style.width = `${
									prevDimensions.right -
									initialDimensions.left
								}px`;
							}
							if ( selectionState() && initialCell.x - prevCell.x > 0) {
								console.log(
									"New Width",
									-1 *
										(prevDimensions.left -
											initialDimensions.right),
								);
								containerElement.style.left = `${prevDimensions.left}px`;
								containerElement.style.width = `${
									initialDimensions.right -
									prevDimensions.left
								}px`;
							}
							if (initialCell.y - prevCell.y <= 0) {
								containerElement.style.top = `${initialDimensions.top}px`;
								containerElement.style.height = `${
									prevDimensions.bottom -
									initialDimensions.top
								}px`;
							} else {
								containerElement.style.top = `${prevDimensions.top}px`;
								containerElement.style.height = `${
									initialDimensions.bottom -
									prevDimensions.top
								}px`;
							}
						}
					}}
				/>
			) : null}
			{/* {renamingState().x !== -1 ? (
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
			) : null} */}
			<button
				onClick={() => {
					setSelectionState(!selectionState());
				}}
				classList={{
					"bg-green-500": selectionState(),
					"bg-red-600": !selectionState(),
				}}
				class="px-2 py-1 rounded-lg scale-125 hover:scale-110 active:scale-100 transition-transform ease-out"
			></button>
			<section class="max-w-4xl w-full h-96 flex items-center justify-center">
				<div id="table" class="flex w-max p-2">
					<Index each={store.table.columns}>
						{(column, x) => {
							let isFirst = x === 0;
							return (
								<div
									id={`column-${x + 1}`}
									class="bg-white group flex flex-col w-max border-slate-700"
								>
									<button
										id={`header-${x + 1}`}
										class="bg-slate-400 group-hover:bg-slate-500 hover:!bg-slate-600 px-3 py-1 border-slate-600 border-b text-left"
										classList={{ "border-l": !isFirst }}
										onClick={(el) => {
												RenamingHandler(
													el.currentTarget,
													{
														x: x + 1,
													},
												);
										}}
									>
										<span class="text-white uppercase">
											{column().label}
										</span>
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
														id={`cell-${x + 1}-${
															y + 1
														}`}
														class="hover:bg-slate-100 text-slate-900 hover:text-slate-900 px-3 py-1 border-slate-600 w-full text-left"
														classList={{
															"border-t":
																!isFirst,
														}}
														onClick={(el) => {
																ResizerHandler(
																	el.currentTarget,
																	{
																		cell: {
																			x:
																				x +
																				1,
																			y:
																				y +
																				1,
																		},
																	},
																);
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
														<span class="">
															{cell().label}
														</span>
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
