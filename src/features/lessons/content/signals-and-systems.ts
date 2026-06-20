import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_signals",
  slug: "signals-and-systems",
  title: "Signals & Systems: Convolution, Fourier, and Why Your Music Is 44,100 Numbers a Second",
  summary:
    "Shout in an empty cathedral and listen to the echo bloom — you just measured an impulse response, and you're one step from understanding why every audio plugin, radio, and noise-canceling headphone on Earth works. This lesson turns vague intuitions into the core machinery of engineering: what a signal even *is*, why LTI systems are the friendliest things in the universe, how convolution lets one number — the impulse response — predict the output for *any* input, the time-frequency duality that Fourier hands you for free, and the sampling theorem that decides why your music is exactly 44,100 numbers per second. One playground, two predictions, and a worked example that picks a sample rate and catches an alias red-handed.",
  discipline: "ELECTRICAL",
  difficulty: "HARD",
  estMinutes: 24,
  tags: ["signals-systems", "convolution", "fourier"],
  objectives: [
    "Define a signal and a system, and state what the two defining properties of an LTI system (linearity and time-invariance) buy you.",
    "Explain why the impulse response h fully characterizes an LTI system, and write the input-output relationship as a convolution y = x ∗ h.",
    "Describe the time-frequency duality of the Fourier transform and why convolution in time becomes simple multiplication in frequency.",
    "State the Nyquist-Shannon sampling theorem and compute a minimum sample rate from a signal's highest frequency.",
    "Explain aliasing — what it is, why undersampling causes it, and how an anti-aliasing filter prevents it.",
  ],
  prerequisites: [
    "Functions, graphs, and basic trigonometry (sinusoids)",
    "Integrals and sums (you'll see the convolution integral)",
    "Comfort with complex numbers helps for Fourier, but isn't required",
  ],
  interviewAngle:
    "Signals & systems is the language half of an EE/CS interview is conducted in, so interviewers probe whether you actually *get* it or just memorized transforms. Expect to define LTI and explain why those two properties matter, derive the convolution relationship from the impulse response, articulate time-frequency duality, and nail the sampling theorem with a real number (\"why 44.1 kHz?\") plus a clean explanation of aliasing. Strong candidates connect the math to the physical picture — an echo as an impulse response, a chord as a spectrum, a wagon wheel spinning backward as an alias — and always state their assumptions (LTI, band-limited).",
  blocks: [
    {
      id: "b_hook",
      kind: "PROSE",
      title: "The cathedral clap 🔊",
      markdown:
        "Walk into a big empty cathedral and clap once — sharp, instantaneous. What comes back isn't a clap; it's a long, blooming echo that swells and fades over seconds. Here's the wild part: you just performed a complete engineering measurement. That echo is the cathedral's **impulse response** — its fingerprint — and from that single recording you can predict what *any* sound, a violin, a voice, a whole orchestra, will sound like in that room. Record the clap, and you can make a dry studio vocal sound like it was sung in that exact cathedral. (This is literally how reverb plugins work.)\n\nThat near-magic — *measure the response to one sharp poke, predict the response to everything* — is the beating heart of signals and systems. It works because of a property called **LTI**, and the operation that turns the impulse response into predictions is called **convolution**. By the end of this lesson you'll see why these aren't abstract math toys; they're the reason radios tune, headphones cancel noise, and your music is stored as a precise stream of numbers.\n\nWe'll chase four big ideas:\n\n- What signals and systems *are*, and why LTI systems are the well-behaved royalty of the system world.\n- How the impulse response + convolution (`y = x ∗ h`) predicts any output.\n- The Fourier transform's time-frequency duality — and the slick payoff that convolution becomes *multiplication*.\n- The sampling theorem and Nyquist — why 44.1 kHz, and what goes horribly wrong (aliasing) if you skimp.\n\nLet's turn that echo into engineering.",
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "PvvzJgexm-I",
      title: "Watch: Convolution, Impulse Response & LTI Systems",
    },
    {
      id: "b_signals_systems_prose",
      kind: "PROSE",
      title: "Signals in, systems do something, signals out",
      markdown:
        "Strip away the jargon and it's simple.\n\n- A **signal** is just a function carrying information — usually how some quantity varies over time (or space). Audio is air pressure vs time. An ECG is voltage vs time. A photo is brightness vs position. Signals come in two breeds: **continuous-time** (defined at every instant, like the analog voltage from a microphone) and **discrete-time** (defined only at sample instants, like the numbers in a .wav file). Bridging those two worlds is what sampling is all about — we'll get there.\n- A **system** is anything that takes a signal in and produces a signal out: an amplifier, a filter, the cathedral, a guitar pedal, a stretch of copper wire, an algorithm. You feed it `x(t)` (input) and it hands you `y(t)` (output).\n\nThe entire field is the study of how systems transform signals — and the trick to making that study *tractable* is to focus on a beautifully well-behaved class of systems. Almost every system you meet in an intro course (and a shocking number in real life, at least approximately) belongs to it. It's called **LTI**, and its two letters are about to do an enormous amount of work.",
    },
    {
      id: "b_lti_prose",
      kind: "PROSE",
      title: "LTI: the two superpowers",
      markdown:
        "**LTI** stands for **Linear** and **Time-Invariant**, and these two properties together are what make signals-and-systems analysis possible instead of hopeless.\n\n- **Linear** = the system obeys *superposition*, which bundles two rules. **Scaling (homogeneity):** double the input, the output doubles. **Additivity:** the response to (input A + input B) equals (response to A) + (response to B) — no interaction, no cross-terms. Linearity means you can break any messy input into simple pieces, run each piece through separately, and just *add up* the results. That divide-and-conquer freedom is everything.\n- **Time-Invariant** = the system doesn't change over time. Feed it the same input today or tomorrow and you get the same output, just shifted to match. Delay the input by 5 seconds and the output is the identical shape, delayed by 5 seconds — the system has no internal clock that alters its behavior.\n\nWhy do we care so fiercely? Because of a stunning consequence. Suppose you decompose *any* input signal into a dense train of tiny scaled-and-shifted **impulses** (think: an infinitely sharp spike of unit area, the mathematical idealization of that cathedral clap). Linearity says the output is the sum of the responses to each impulse. Time-invariance says every impulse produces the *same* response shape, just shifted and scaled to match. So if you know the system's response to *one* impulse — its **impulse response `h(t)`** — you can reconstruct the output for **every possible input**. One measurement. Infinite predictions. That's the cathedral clap, formalized.",
    },
    {
      id: "b_predict_linear",
      kind: "PREDICT",
      question:
        "An audio system is LTI. You feed it tone A alone and record output A; you feed it tone B alone and record output B. Now you feed it tone A and tone B together. What comes out?",
      options: [
        { id: "p1", label: "Exactly output A + output B added together (superposition)" },
        { id: "p2", label: "A brand-new output with extra frequencies the inputs didn't have" },
        { id: "p3", label: "Whichever output is louder; the quieter one is suppressed" },
        { id: "p4", label: "It depends on the order you fed the tones in" },
      ],
      answerId: "p1",
      reveal:
        "**Output A + output B, exactly.** That's the *linearity* (superposition) property doing its signature trick: the response to a sum of inputs is the sum of the responses, with no interaction and no new frequencies conjured up. This is precisely what *separates* an LTI system from a nonlinear one — a nonlinear system (like an overdriven guitar amp) generates new harmonics and intermodulation tones that weren't in either input, which is exactly why distortion pedals sound 'dirty.' An LTI system can only scale and delay the frequencies already present; it can never invent new ones. That 'no new frequencies' guarantee is the deep reason the frequency domain is so powerful for LTI systems.",
    },
    {
      id: "b_convolution_prose",
      kind: "PROSE",
      title: "Convolution: the machine that makes the prediction",
      markdown:
        "We claimed the impulse response `h(t)` predicts the output for any input `x(t)`. The operation that actually does it is **convolution**, written with an asterisk:\n\n`y(t) = x(t) ∗ h(t)`\n\nIn continuous time it's an integral; in discrete time (the world your computer lives in) it's a sum:\n\n`y[n] = Σ x[k]·h[n − k]`\n\nDon't let the notation scare you — the *recipe* is intuitive. Picture it as **flip, slide, multiply, sum**:\n\n1. **Flip** the impulse response `h` backward in time (that's the `h[n − k]`).\n2. **Slide** it across the input.\n3. At each position, **multiply** the overlapping values and **sum** them up.\n4. That running total, as you slide, *is* the output.\n\nThe physical story is cleaner still. Your input is a stream of impulses. Each input sample sets off a little copy of the impulse response, scaled by that sample's value and started at that sample's time. The output at any instant is just the **sum of all the overlapping, lingering echoes** still ringing from past inputs. The cathedral output at this moment is every past clap's tail, added up. Convolution is the bookkeeping of overlapping echoes.\n\nThis is why convolution is *the* central operation in signal processing: every linear filter — your phone's voice EQ, an image blur, a noise reducer — is, under the hood, a convolution of the signal with some carefully chosen `h`. Choose `h`, and you've chosen what the system does.",
    },
    {
      id: "b_callout_convolution",
      kind: "CALLOUT",
      variant: "tip",
      title: "The intuition that sticks 💡",
      markdown:
        "If the integral makes your eyes glaze, hold onto this image instead: **the impulse response is the system's echo from a single tap, and convolution sums up the overlapping echoes from every tap in your input.** A blur filter? Each bright pixel smears into a little blob (`h`), and convolution lays down a smeared blob for every pixel and adds them. Reverb? Each sound triggers the room's decay, and convolution piles up all the decaying tails. Same operation, same picture, everywhere. Master the echo-summing image and the math is just the receipt.",
    },
    {
      id: "b_fourier_prose",
      kind: "PROSE",
      title: "The Fourier transform: a second pair of glasses",
      markdown:
        "So far we've watched signals in the **time domain** — value vs time. The **Fourier transform** hands you a completely different, equally valid view: the **frequency domain** — *which sinusoids, at which strengths, add up to make this signal.*\n\nThe foundational idea (Fourier's, from 1807) is audacious: **any signal can be built by adding up pure sine waves of different frequencies, amplitudes, and phases.** A square wave? A specific recipe of sinusoids. A drum hit? A broad smear of frequencies. A musical chord? Energy concentrated at a few specific pitches. The Fourier transform takes a signal `x(t)` and returns its **spectrum** `X(f)` — a map of how much of each frequency is in there. The inverse transform rebuilds the time signal from the spectrum. Same information, two languages: **time ↔ frequency**, and you can move between them losslessly. That's the *duality*.\n\nWhy bother with the second view? Because some things that are tangled in time become trivially obvious in frequency. Want to remove 60 Hz hum from a recording? In the time domain it's hopelessly interwoven with the music; in the frequency domain it's a single spike you can snip out. Your ear, by the way, already does a rough Fourier transform — the cochlea sorts incoming sound into frequency bands, which is *why* you perceive pitch at all.\n\nAnd now the punchline that ties the whole lesson together — the single most useful theorem in the field:\n\n**Convolution in time = multiplication in frequency.** If `y(t) = x(t) ∗ h(t)`, then in the frequency domain `Y(f) = X(f)·H(f)` — just *multiply* the spectra, point by point.\n\nThat ugly flip-slide-multiply-sum integral collapses into ordinary multiplication. This is why filtering is so often described in frequency terms (`H(f)`, the *frequency response*, says exactly which frequencies the system boosts or cuts) and why the **Fast Fourier Transform (FFT)** is one of the most important algorithms ever written: it lets computers convolve enormous signals blazingly fast by hopping to the frequency domain, multiplying, and hopping back.",
    },
    {
      id: "b_check_fourier",
      kind: "CHECK",
      question:
        "You need to apply a filter (convolve a long signal with an impulse response h) as efficiently as possible on a computer. Why do engineers often jump to the frequency domain via the FFT to do it?",
      choices: [
        { id: "c1", label: "Because convolution in time becomes simple point-by-point multiplication in frequency, and the FFT makes the round trip cheap" },
        { id: "c2", label: "Because the frequency domain stores signals using less memory than the time domain" },
        { id: "c3", label: "Because the Fourier transform removes noise automatically as a side effect" },
        { id: "c4", label: "Because multiplication in time becomes convolution in frequency, which is faster" },
      ],
      answerId: "c1",
      explanation:
        "The key theorem is the **convolution theorem**: convolution in time corresponds to *multiplication* in frequency (`Y(f) = X(f)·H(f)`). Direct convolution of two long signals is expensive (cost grows roughly with the product of their lengths), but the FFT lets you transform both signals, multiply their spectra point-by-point (cheap), and inverse-transform back — and the FFT itself is fast (about N·log N). So the round trip beats brute-force convolution for long signals. (Option 4 has the duality backwards, and the others invent properties Fourier doesn't have.)",
    },
    {
      id: "b_sampling_prose",
      kind: "PROSE",
      title: "Sampling: cramming continuous reality into a computer",
      markdown:
        "Real-world signals — sound, light, voltage — are **continuous**: defined at every instant. But computers store *numbers*, finitely many of them. To get audio into your laptop, you **sample** it: measure the signal's value at regular intervals, `f_s` times per second (the *sampling rate*), and keep that list of numbers. CD audio is sampled 44,100 times a second.\n\nThe obvious worry: aren't you throwing away everything *between* the samples? Couldn't infinitely many different continuous signals pass through the same dots? In general, yes — which makes the next result feel almost like cheating.\n\n**The Nyquist-Shannon sampling theorem:** if a signal contains no frequencies higher than `f_max`, then sampling at a rate of *at least* `2·f_max` captures it **perfectly** — you can reconstruct the original continuous signal *exactly* from the samples, with zero loss. That threshold, `2·f_max`, is the **Nyquist rate**.\n\nLet that sink in: as long as your signal is *band-limited* (has a top frequency), a finite list of numbers holds *all* the information in the continuous original. Nothing is lost. The dots really do pin down the curve — provided you took them fast enough.\n\nNow the famous number. Human hearing tops out around **20 kHz**. By Nyquist you need at least `2 × 20 kHz = 40 kHz` to capture everything audible. CD audio uses **44.1 kHz** — a little above the minimum, leaving headroom for real-world *anti-aliasing filters* (which can't cut off infinitely sharply) to do their job below the half-sample-rate ceiling. That's the whole reason your music is exactly 44,100 numbers a second per channel. Go drive the relationship yourself in the playground, then we'll see what happens when you *break* the rule.",
    },
    {
      id: "b_sandbox_nyquist",
      kind: "SANDBOX",
      title: "Playground — the Nyquist rate 🎛️",
      description:
        "Slide the highest frequency in your signal and watch the minimum sample rate you need. Set f_max to 20,000 Hz (the top of human hearing) and you'll read 40,000 Hz — the theoretical floor for capturing all audible sound, and the reason CD audio sits just above it at 44.1 kHz. Notice it's strictly linear: there's no free lunch, every extra Hz of bandwidth costs you 2 Hz of sample rate.",
      variables: [
        { key: "fmax", label: "Highest signal frequency", unit: "Hz", min: 100, max: 100000, step: 100, default: 20000 },
      ],
      expression: "2 * fmax",
      outputLabel: "Minimum sample rate (Nyquist)",
      outputUnit: "Hz",
      precision: 0,
    },
    {
      id: "b_predict_alias",
      kind: "PREDICT",
      question:
        "You sample a pure 1,000 Hz tone at only 1,500 Hz — well below its Nyquist rate of 2,000 Hz. When you play back the samples, what do you hear?",
      options: [
        { id: "p1", label: "The original 1,000 Hz tone, perfectly intact" },
        { id: "p2", label: "Silence — the system can't represent it at all" },
        { id: "p3", label: "A different, lower-frequency tone (a 500 Hz alias) that was never in the original" },
        { id: "p4", label: "The 1,000 Hz tone, but quieter" },
      ],
      answerId: "p3",
      reveal:
        "**A phantom 500 Hz tone — an alias.** When you sample below the Nyquist rate, frequencies above half the sample rate don't just disappear; they get *folded down* and masquerade as lower frequencies that were never in the signal. Here, half the sample rate is 750 Hz, and the 1,000 Hz tone reflects across it to appear as `1500 − 1000 = 500 Hz`. The dots you captured are *also* consistent with a genuine 500 Hz tone, and your playback has no way to tell them apart. This is **aliasing** — the same effect that makes wagon wheels spin backward in movies (the frame rate undersamples the spokes) and stroboscopes appear to freeze fans. The cure is to *band-limit before sampling*: an anti-aliasing low-pass filter removes everything above half the sample rate so nothing can fold down.",
    },
    {
      id: "b_aliasing_prose",
      kind: "PROSE",
      title: "Aliasing: the ghost that haunts undersampling",
      markdown:
        "Aliasing is what the sampling theorem is *protecting you from*. Break the Nyquist rule — sample slower than `2·f_max` — and any frequency above `f_s/2` (the **Nyquist frequency**, half your sample rate) gets **folded down** and impersonates a lower frequency. Your samples become ambiguous: they fit the real high-frequency signal *and* a fake low-frequency one equally well, and once sampled, that distortion is **permanently baked in** — no filter afterward can untangle the impostor from a genuine low tone, because they're now literally identical numbers.\n\nYou've seen aliasing your whole life:\n\n- **Wagon-wheel effect:** a movie camera's 24 frames/sec undersamples a fast-spinning wheel, so the spokes appear to crawl, freeze, or rotate *backward*.\n- **Moiré patterns:** photographing a finely striped shirt with a camera sensor whose pixel grid undersamples the stripes produces shimmering false patterns.\n- **A high whine turning into a low warble** when audio gear is undersampled.\n\nThe fix is simple and universal: **filter before you sample.** Every real analog-to-digital converter has an **anti-aliasing filter** — a low-pass filter that chops off everything above the Nyquist frequency *before* the sampler ever sees it. No high frequencies present means nothing to fold down. (The reason CD uses 44.1 kHz rather than a razor's-edge 40 kHz is exactly to give that filter a little slope room to roll off cleanly above 20 kHz.) Prevention is the only cure — which is precisely why the right move is always to sample fast enough *and* band-limit first.",
    },
    {
      id: "b_worked",
      kind: "WORKED_EXAMPLE",
      title: "Pick a sample rate, then catch an alias",
      problem:
        "You're digitizing audio from an instrument whose energy spans up to 18 kHz. (a) What is the minimum (Nyquist) sample rate that captures it without loss? (b) For practical reasons (real anti-aliasing filters aren't perfectly sharp), would you sample exactly at that rate? (c) Suppose a careless engineer instead samples at only 30 kHz without any anti-aliasing filter, and a stray 18 kHz component sneaks through. What false frequency appears in the recording?",
      steps: [
        {
          label: "Step 1 — (a) Apply the Nyquist theorem",
          markdown:
            "The signal's highest frequency is `f_max = 18 kHz`. The sampling theorem says the minimum (Nyquist) rate is `2·f_max`. So `f_s,min = 2 × 18 kHz = 36 kHz`. At or above 36 kHz, the band-limited signal can be reconstructed perfectly.",
        },
        {
          label: "Step 2 — (b) Why you'd sample a bit higher",
          markdown:
            "Sampling at *exactly* 36 kHz puts the Nyquist frequency right at 18 kHz, with zero margin — and real anti-aliasing filters can't drop from full-pass to full-stop instantly; they roll off over a finite band. You'd choose a rate comfortably above 36 kHz (e.g. 44.1 kHz or 48 kHz) so the filter has room to attenuate everything above the Nyquist frequency before it folds. This is the same headroom logic behind CD's 44.1 kHz for 20 kHz hearing.",
        },
        {
          label: "Step 3 — (c) Set up the aliasing fold",
          markdown:
            "At `f_s = 30 kHz`, the Nyquist frequency (the fold point) is `f_s/2 = 15 kHz`. The 18 kHz component is *above* 15 kHz, so it aliases. A frequency `f` above Nyquist folds down to `f_s − f` (for f between f_s/2 and f_s).",
        },
        {
          label: "Step 4 — Compute the alias",
          markdown:
            "`f_alias = f_s − f = 30 kHz − 18 kHz = 12 kHz`. So the genuine 18 kHz energy shows up in the recording as a phantom **12 kHz** tone — audible, wrong, and impossible to remove after the fact because the samples are now indistinguishable from a real 12 kHz signal.",
        },
        {
          label: "Step 5 — The lesson",
          markdown:
            "Two failures compounded: the sample rate (30 kHz) was below the Nyquist requirement (36 kHz) for an 18 kHz signal, *and* there was no anti-aliasing filter to band-limit the input first. Either fix alone would have helped — sample faster, or filter out everything above 15 kHz before sampling. Do both and you're safe.",
        },
      ],
      answer:
        "(a) Minimum sample rate = 2 × 18 kHz = 36 kHz. (b) No — sample higher (e.g. 44.1 or 48 kHz) to give the anti-aliasing filter roll-off room. (c) Sampling at 30 kHz with no filter, the 18 kHz component aliases to 30 − 18 = 12 kHz, a phantom tone permanently baked into the recording.",
    },
    {
      id: "b_check_nyquist",
      kind: "CHECK",
      question:
        "An audio signal contains frequencies up to 22 kHz. An engineer samples it at 40 kHz with no anti-aliasing filter. What is the main problem?",
      choices: [
        { id: "c1", label: "No problem — 40 kHz is a standard audio rate, so it's always fine" },
        { id: "c2", label: "Frequencies between 20 kHz and 22 kHz exceed the Nyquist frequency (20 kHz) and will alias into the audible band" },
        { id: "c3", label: "The sample rate is far too high, wasting storage with no benefit" },
        { id: "c4", label: "Nothing above 20 kHz matters, so the signal is captured perfectly" },
      ],
      answerId: "c2",
      explanation:
        "At `f_s = 40 kHz`, the Nyquist frequency is `f_s/2 = 20 kHz`. To capture content up to 22 kHz losslessly you'd need at least `2 × 22 = 44 kHz`. The 20–22 kHz content sits *above* the 20 kHz Nyquist frequency, so with no anti-aliasing filter it folds back down (e.g. a 22 kHz tone aliases to 40 − 22 = 18 kHz) and contaminates the audible band — permanently. The fix: either raise the sample rate to ≥ 44 kHz, or low-pass filter out everything above 20 kHz *before* sampling. The choice 'nothing above 20 kHz matters' is the trap — it's true for *hearing*, but those frequencies are still in the *signal* and will alias unless removed first.",
    },
    {
      id: "b_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "In the interview 🎯",
      markdown:
        "The recurring prompts and the moves that score them:\n\n- **\"What does LTI mean and why do we care?\"** Linear (superposition: scaling + additivity) and time-invariant (no internal clock). The payoff: the impulse response `h(t)` *fully* characterizes the system, so you can predict any output by convolution. Name superposition explicitly.\n- **\"What's convolution, intuitively?\"** Flip-slide-multiply-sum — or better, 'summing the overlapping echoes that each input sample triggers.' Then drop the bomb: convolution in time = multiplication in frequency (`Y(f) = X(f)·H(f)`), which is why we filter in the frequency domain and why the FFT matters.\n- **\"State the sampling theorem.\"** A band-limited signal with max frequency `f_max` is perfectly reconstructable if sampled at ≥ `2·f_max` (the Nyquist rate). Use the 44.1 kHz / 20 kHz example to show you've internalized it.\n- **\"What is aliasing and how do you prevent it?\"** Frequencies above `f_s/2` fold down and impersonate lower ones, permanently. Prevent it with an anti-aliasing low-pass filter *before* sampling (and/or a higher sample rate). Mention the wagon-wheel effect for color.\n\nWinning pattern: **physical picture (echo, chord, wagon wheel) → the math (convolution, transform, 2·f_max) → the engineering consequence**, and always state your assumptions (LTI, band-limited).",
    },
    {
      id: "b_outro",
      kind: "PROSE",
      title: "The whole chain, in one breath",
      markdown:
        "Remember the cathedral clap? You've now got the machinery behind it. A **signal** is information over time; a **system** transforms it; and the friendly, ubiquitous **LTI** systems are friendly precisely because two properties — linearity (superposition) and time-invariance — mean a single **impulse response `h`** captures everything the system does. **Convolution** (`y = x ∗ h`) cashes that in, summing the overlapping echoes every input sample sets off. The **Fourier transform** gives you a second, lossless view — time ↔ frequency — where the messy convolution collapses into plain multiplication (`Y = X·H`), which is why we filter in frequency and why the FFT is everywhere. And to drag continuous reality into a computer, the **sampling theorem** promises perfect capture at `2·f_max` — the reason your music is 44,100 numbers a second — while **aliasing** is the ghost that punishes anyone who samples too slowly or forgets to band-limit first.\n\nNext time you clap in a big empty room and hear the bloom, you'll know you just measured an impulse response — and that, with one operation, it predicts everything that room will ever do to a sound. That's not magic. That's LTI.",
    },
  ],
  keyTakeaways: [
    "A signal carries information over time (or space); a system transforms an input signal into an output. LTI systems — Linear (superposition: scaling + additivity) and Time-Invariant (no internal clock) — are the well-behaved class that makes analysis tractable.",
    "Because of LTI, the impulse response h(t) fully characterizes a system: measure the response to one sharp impulse and you can predict the output for any input. (That's the cathedral clap.)",
    "Convolution (y = x ∗ h) is that prediction in action — flip, slide, multiply, sum — physically, the summing of overlapping echoes triggered by each input sample. Every linear filter is a convolution.",
    "The Fourier transform gives a lossless time ↔ frequency duality: any signal is a sum of sinusoids, and its spectrum X(f) shows how much of each frequency is present. Some problems (e.g. removing 60 Hz hum) are trivial in frequency, tangled in time.",
    "Convolution in time equals multiplication in frequency (Y(f) = X(f)·H(f)) — the convolution theorem — which is why filtering is described via the frequency response H(f) and why the FFT is one of the most important algorithms ever.",
    "The Nyquist-Shannon sampling theorem: a band-limited signal with max frequency f_max is reconstructed perfectly from samples taken at ≥ 2·f_max (the Nyquist rate). This is why 20 kHz hearing → ~40 kHz minimum → 44.1 kHz CD audio.",
    "Aliasing: sampling below 2·f_max folds frequencies above f_s/2 down into false lower frequencies, permanently corrupting the signal. Prevent it with an anti-aliasing low-pass filter before sampling (and adequate headroom in the sample rate).",
  ],
};
