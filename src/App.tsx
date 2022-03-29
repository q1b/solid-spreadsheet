import {
	ReactMediaRecorderRenderProps,
	useReactMediaRecorder,
} from "./core/Recorder";
import {
	Accessor,
	children as specializeChildren,
	ComponentProps,
	createEffect,
	createReaction,
	createSignal,
	Index,
	on,
	onCleanup,
	Setter,
	Show,
	splitProps,
} from "solid-js";
import store, { makeStoreFromCSV, updateCellAudioURL } from "./store";
import MicrophonePlayStopBtn from "./assets/icons/microphone";
import RecordingPlayPauseBtn from "./assets/icons/play";
import { RemoveBtn } from "./assets/icons/Remove";

const App = () => {
	const Recorder = useReactMediaRecorder({
		video: false,
		audio: true,
	});
	const initRes = [
		["company", "type", "since"],
		["nike", "sports", "25 January 1964"],
		["Cartoon Network", "kids&teens", "1 October 1992"],
		["apple", "technology", "1 April 1976"],
		["google", "technology", "4 September 1998"],
		["airasia", "Airlines", "20 December 1993"],
		["microsoft", "technology", "4 April 1975"],
		["H&M", "cloths", "4 October 1947"],
		["adidas", "sport", "18 August 1949"],
	];
	const [currentRecordingCell, setCurrentRecordingCellURL] =
		createSignal<string>('');
	const [audioElement, setAudioElement] = createSignal<
		HTMLAudioElement | undefined
	>();
	makeStoreFromCSV(initRes);
	return (
		<section class="min-h-screen flex flex-col bg-slate-900 items-center justify-center">
			{currentRecordingCell() ? (
				<audio
					ref={(el) => {
						setAudioElement(el);
					}}
					src={currentRecordingCell()}
					class="hidden"
					autoplay
				/>
			) : null}
			<span class="text-white">{Recorder.status()}</span>
			<article class="flex bg-white">
				<div id="table" class="flex">
					<Index each={store.table.columns}>
						{(column, x) => {
							let isFirst = x === 0;
							return (
								<div
									id={`column-${x + 1}`}
									class="flex flex-col w-max border-indigo-700"
								>
									<Header
										at={x + 1}
										class={!isFirst ? "border-l" : ""}
									>
										{column().label}
									</Header>
									<div
										id={`cells-${x + 1}`}
										class="bg-white border-indigo-600 flex flex-col"
										classList={{ "border-l": !isFirst }}
									>
										<Index each={column().cells}>
											{(cell, y) => {
												let isFirst = y === 0;
												return (
													<Cell
														audioRef={audioElement}
														currentRecordingCell={currentRecordingCell}
														setCurrentRecordingCell={setCurrentRecordingCellURL}
														Recorder={Recorder}
														cellDetails={cell}
														class={
															isFirst
																? ""
																: "border-t"
														}
													/>
												);
											}}
										</Index>
									</div>
								</div>
							);
						}}
					</Index>
				</div>
			</article>
		</section>
	);
};

const cclass = `
 	px-3 py-1 
`;

type Header<P = {}> = P & {
	at: number;
};

const Header = (props: Header<ComponentProps<"button">>) => {
	const [local, others] = splitProps(props, ["at", "class", "children"]);
	const children = specializeChildren(() => local.children);
	return (
		<button
			class={
				`bg-indigo-500 text-white  hover:bg-indigo-600 border-indigo-600 border-b text-left ${cclass} ` +
					local.class || ""
			}
			{...others}
		>
			{children()}
		</button>
	);
};

type Cell<P = {}> = P & {
	audioRef:Accessor<HTMLAudioElement|undefined>,
	currentRecordingCell: Accessor<string>
	setCurrentRecordingCell:Setter<string>
	Recorder: ReactMediaRecorderRenderProps;
	cellDetails: Accessor<{
		readonly x: number;
		readonly y: number;
		readonly label: string;
		readonly audioURL?: string | undefined;
	}>;
};

const Cell = (props: Cell<ComponentProps<"div">>) => {
	const [local, others] = splitProps(props, [
		"audioRef",
		"currentRecordingCell",
		"setCurrentRecordingCell",
		"cellDetails",
		"Recorder",
		"class",
		"children",
	]);
	const [recordingState, setRecordingState] = createSignal<boolean>(false);
	const [isPlaying, setPlayingState] = createSignal<boolean>(false);
	const track = createReaction(() => {
		updateCellAudioURL(
			local.cellDetails().x,
			local.cellDetails().y,
			local.Recorder.mediaBlobUrl(),
		);
		local.Recorder.resetBlobUrl();
	});
	const handleRecording = () => {
		if (local.Recorder.status() === "idle") {
			local.Recorder.startRecording();
		} else {
			local.Recorder.stopRecording();
			track(() => {
				local.Recorder.mediaBlobUrl();
			});
		}
	};
	const handlePlayingPause = () => {
		const audioURL = local.cellDetails().audioURL
		const audioElement = local.audioRef();
		if(audioURL !== local.currentRecordingCell()){
			if(audioURL) local.setCurrentRecordingCell(audioURL);
			if(audioElement && audioURL !== undefined){
				audioElement.src = audioURL;
				audioElement.play();
			}
		}
		if(isPlaying()){
			audioElement?.pause();
		}else{
			audioElement?.play();
		}
	}
	return (
		<div
			class={
				`flex text-sm gap-x-5 place-content-between hover:bg-indigo-100 text-indigo-900 hover:text-indigo-900  items-center ${cclass} ` +
					local.class || ""
			}
			{...others}
		>
			{local.cellDetails().label}
			<div class="flex items-center gap-x-2">				 
				<Show
					when={local.cellDetails()?.audioURL}
					fallback={
						<>
						<span class="w-6">
							🔴
						</span>
						<MicrophonePlayStopBtn
							ref={(el) => {
								el.addEventListener("click",handleRecording);
								onCleanup(() => {
									el.removeEventListener("click",handleRecording);
								});
							}}
							colors={[
								{
									fill: "#923CF8",
									stroke: "#FFF",
								},
								{
									fill: "#818CF8",
									stroke: "#FFF",
								},
							]}
							state={recordingState}
							setState={setRecordingState}
						/>
						</>
					}
				>
					<RecordingPlayPauseBtn
						ref={(el) => {
							el.addEventListener("click",handlePlayingPause);
							onCleanup(() => {
								el.removeEventListener("click",handlePlayingPause);
							});
						}}
						state={isPlaying}
						setState={setPlayingState}
					/>
					<RemoveBtn onClick={()=>{
						local.Recorder.clearBlobUrl(local.cellDetails().audioURL);
						updateCellAudioURL(local.cellDetails().x,local.cellDetails().y,undefined);
					}}/>
				</Show>
			</div>
		</div>
	);
};
export default App;
