class QuickError extends HTMLElement {
	static observedAttributes = ["errtitle", "errmessage"];

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: none;
					--qe-base: #b8324a;
					
					--qe-bg: var(--qe-base);
					--qe-bg-light: color-mix(in srgb, var(--qe-base), white 15%);
					--qe-border-accent: color-mix(in srgb, var(--qe-base), white 25%);
					--qe-accent: color-mix(in srgb, var(--qe-base), white 65%);
					--qe-accent-dark: color-mix(in srgb, var(--qe-base), black 55%);
					--qe-message-color: color-mix(in srgb, var(--qe-base), white 80%);
					--qe-icon-stroke: color-mix(in srgb, var(--qe-base), black 40%);
					--qe-shadow-color: color-mix(in srgb, var(--qe-base), black 45%);
					--qe-title-shadow: color-mix(in srgb, var(--qe-accent-dark) 50%, transparent);
				}
				:host([onscreen]) {
					display: flex;
				}
				
				circle, line {
					stroke: var(--qe-icon-stroke);
				}
				feFlood {
					flood-color: var(--qe-shadow-color);
				}
				
				#error{
					display: flex;
					flex-direction: row;
					position: absolute;
					align-items:stretch;
					background-color: var(--qe-bg);
					border-radius: 0.33rem;
					z-index: 1000;
					box-shadow: 0 0 30px -10px #000;
					left: 50%;
				    top: 33%;
				    transform: translateX(-50%);
				    width: min(500px, 90vw);
				    animation: fadeInUp 0.2s ease-in-out;
				    border-top: 1px solid color-mix(in srgb, var(--qe-accent) 43%, transparent);
				}
				#error.closing {
					animation: fadeOutUp 0.2s ease-in-out forwards;
				}
				
				@keyframes fadeOutUp {
					from { opacity: 1; transform: translateX(-50%) translateY(0); }
					to { opacity: 0; transform: translateX(-50%) translateY(-30px); }
				}
				@keyframes fadeInUp {
					from { opacity: 0; transform: translateX(-50%) translateY(30px); }
					to { opacity: 1; transform: translateX(-50%) translateY(0); }
				}
				
				#message{
					flex-grow: 1;
					font-size: 0.8rem;
					color: var(--qe-message-color);
					margin-top: 0.66rem;
					margin-bottom: 2rem;
				}
				
				#main{
					display: flex;
					padding: 1rem;
					flex-direction: column;
					align-items: center;
					width: 66%;
					border-left: 1px solid var(--qe-border-accent);
					text-align: center;
				}
				
				button {
					padding: 0.66rem 1.66rem;
					border-radius: 0.33rem;
					font-size: 0.75rem;
					font-weight: bold;
					text-transform: uppercase;
					width: 66%;
					background-color: transparent;
					border: 1pt solid var(--qe-accent);
					color: var(--qe-accent);
					transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;
				}
				button:hover{
					background-color: var(--qe-accent);
				    color: var(--qe-accent-dark);
					cursor: pointer;
				}
				
				svg{
					width: 60%;
				}
				#gfx{
					width: 33%;
					border-radius: 0.33rem 0 0 0.33rem;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					background-image: linear-gradient(var(--qe-bg-light), var(--qe-bg));
				}
				
				#title{
					font-size: 1.1rem;
					color: #FFF;
					font-weight: 700;
					text-shadow: color-mix(in srgb, var(--qe-accent-dark) 50%, transparent) 0 2px 0;
				}
			</style>
			<div id="error">
				<div id="gfx">
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<title/>
						<filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
							<feComponentTransfer in=SourceAlpha>
								<feFuncA type="table" tableValues="1 0" />
							</feComponentTransfer>
							<feGaussianBlur stdDeviation="1.5"/>
							<feOffset dx="0" dy="2" result="offsetblur"/>
							<feFlood result="color"/>
							<feComposite in2="offsetblur" operator="in"/>
							<feComposite in2="SourceAlpha" operator="in" />
							<feMerge>
								<feMergeNode in="SourceGraphic" />
								<feMergeNode />
							</feMerge>
					  	</filter>
						<g id="Complete">
							<g id="x-circle">
								<g filter="url(#inset-shadow)">
									<circle 
										cx="12" cy="12" data-name="--Circle" fill="none" id="_--Circle" r="10" 
										stroke-linecap="round" stroke-linejoin="round" 
										stroke-width="2"
									/>
									<line 
										fill="none" stroke-linecap="round" 
										stroke-linejoin="round" stroke-width="2" x1="14.5" 
										x2="9.5" y1="9.5" y2="14.5"
									/>
									<line 
										fill="none" stroke-linecap="round" 
										stroke-linejoin="round" stroke-width="2" x1="14.5" 
										x2="9.5" y1="14.5" y2="9.5"
									/>
								</g>
							</g>
						</g>
					</svg>
				</div>
				<div id="main">
					<div id="title"></div>
					<div id="message"></div>
					<button>Close</button>
				</div>
			</div>
		`;

		this.shadowRoot.querySelector("#error button").addEventListener('click', e => {
			const error = this.shadowRoot.querySelector("#error");
			error.classList.add("closing");
			error.addEventListener("animationend", () => {
				this.onscreen = false;
				error.classList.remove("closing");
			}, { once: true });
		});
	}

	attributeChangedCallback(nom, avant, apres) {
		if (nom === "errmessage") {
			this.shadowRoot.querySelector("#message").textContent = apres ?? "Please define an error message";
		}

		if(nom === "errtitle"){
			this.shadowRoot.querySelector("#title").textContent = apres ?? "Please define a title";
		}
	}

	get errmessage() {
		return this.getAttribute("errmessage");
	}

	set errmessage(val) {
		this.setAttribute("errmessage", val);
	}

	get errtitle(){
		return this.getAttribute("errtitle");
	}

	set errtitle(val) {
		this.setAttribute("errtitle", val);
	}

	get onscreen() {
		return this.hasAttribute("onscreen");
	}
	set onscreen(val) {
		if (val) this.setAttribute("onscreen", "");
		else this.removeAttribute("onscreen");
	}
}

customElements.define("quick-error", QuickError);