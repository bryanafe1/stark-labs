import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "signals_systems_lti_superposition",
    slug: "concept-signals-systems-lti-superposition",
    title: "Why LTI Lets You Predict Everything from One Response",
    prompt: "You are characterizing an unknown analog audio preamp. A colleague claims that if you simply record the circuit's response to a single sharp click (an approximate impulse), you can predict its output for ANY input signal whatsoever.",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["signals-systems", "conceptual"],
    skillAreas: ["signals-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why measuring just the impulse response is enough to predict the output for any input, and state exactly what assumptions about the system make this true. What is the mathematical operation that turns the impulse response plus an arbitrary input into the output?",
        rubric: "An excellent answer states the system must be Linear (superposition: scaling and adding inputs scales and adds outputs) and Time-Invariant (a shifted input gives an equally shifted output). It explains that any input can be decomposed into a continuum (or sum) of scaled, shifted impulses, and by linearity plus time-invariance the output is the same superposition of scaled, shifted impulse responses. It names the operation as convolution, y(t) = x(t) * h(t) = integral of x(tau)*h(t - tau) d tau, and notes the impulse response h(t) fully characterizes an LTI system. Key insight: LTI is what collapses an infinite-dimensional problem into a single measured signal because impulses form a basis and the system commutes with shifts.",
      },
      {
        prompt: "Part 2: Now the constraints change. You discover the preamp has an automatic gain control (AGC) that quietly reduces gain when the input gets loud. Does the single-impulse-response trick still work? Explain what specifically breaks and how you would even know from measurements.",
        rubric: "An excellent answer recognizes AGC makes the system nonlinear (and effectively time-varying): gain depends on signal amplitude, so superposition fails. It explains that the impulse response measured at one level does not predict behavior at another level, so convolution no longer holds. It gives a concrete test: scale the input by 2 and check whether the output scales by exactly 2 (homogeneity), or sum two inputs and check additivity; failure of either reveals nonlinearity. It may note harmonic distortion / new frequencies appearing as a tell. Key insight: convolution-from-impulse-response is a privilege of linearity; amplitude-dependent gain destroys superposition so one measurement no longer generalizes.",
      },
    ],
  },
  {
    id: "signals_systems_convolution_smoothing",
    slug: "concept-signals-systems-convolution-smoothing",
    title: "Reading Convolution as Physical Smearing",
    prompt: "A junior engineer passes a sharp rectangular voltage pulse through an RC low-pass filter and is surprised the output is not rectangular but rounded, with sloped edges and a wider apparent duration.",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["signals-systems", "conceptual"],
    skillAreas: ["signals-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Using the intuition of convolution as a sliding, flip-and-weight operation, explain physically why the output is rounded and stretched. Connect the shape of the RC filter's impulse response to what happens at the rising and falling edges of the pulse.",
        rubric: "An excellent answer describes the RC impulse response as a one-sided decaying exponential h(t) = (1/RC)*exp(-t/RC) for t >= 0, representing a memory that fades over time ~RC. It explains convolution as sliding this kernel over the input and computing a weighted running average, so the output at each instant blends recent input. Sharp edges get smoothed because the kernel cannot respond instantly; the rising edge becomes an exponential charge curve, the falling edge an exponential decay, and the response smears beyond the original pulse width by roughly RC. Key insight: convolution with a finite-width, causal kernel is a weighted moving average, so it blurs fast features and spreads energy in time by about the kernel's duration.",
      },
      {
        prompt: "Part 2: Now the constraints change. Suppose you keep the same input pulse but the pulse width becomes much SHORTER than RC (a brief spike). Describe how the output shape changes and what the output essentially becomes, and explain why in terms of convolution.",
        rubric: "An excellent answer states that when the input is much narrower than the kernel's timescale, the input approximates a scaled impulse, so the output approaches a scaled copy of the impulse response itself: a sharp rise followed by an exponential decay over ~RC. The output amplitude is set by the pulse's area (its integral), not its peak, because convolving with a near-impulse samples the kernel scaled by that area. The output duration is now dominated by RC, not the input. Key insight: convolution by a narrow input reveals the system's impulse response, and only the input's area matters; conversely a system smears the narrower of the two signals into the shape of the wider one.",
      },
    ],
  },
  {
    id: "signals_systems_aliasing_nyquist",
    slug: "concept-signals-systems-aliasing-nyquist",
    title: "When a Fast Signal Masquerades as a Slow One",
    prompt: "A data-acquisition system samples a sensor at 1 kHz. An engineer is confident this is fine because the signal of interest sits at 200 Hz, comfortably below half the sample rate. In testing, a clean 950 Hz tone from a nearby motor shows up in the recorded data as a steady 50 Hz oscillation that nothing in the system actually produces.",
    discipline: "ELECTRICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["signals-systems", "conceptual"],
    skillAreas: ["signals-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why the real 950 Hz tone appears as a phantom 50 Hz tone. State the Nyquist criterion, explain what aliasing is, and show how to predict the aliased frequency from the sample rate.",
        rubric: "An excellent answer states Nyquist: to represent a signal without aliasing you must sample faster than twice its highest frequency (fs > 2*fmax), here fs = 1000 Hz with Nyquist 500 Hz. It explains aliasing as distinct frequencies becoming indistinguishable after sampling because sampling makes the spectrum periodic with period fs. It computes the alias: |950 - 1000| = 50 Hz (more generally fold f about multiples of fs / take |f - round(f/fs)*fs|). So 950 Hz folds down to 50 Hz and is impossible to separate from a true 50 Hz tone after sampling. Key insight: above Nyquist, frequencies wrap into the baseband and become permanently ambiguous; no post-processing can undo it.",
      },
      {
        prompt: "Part 2: Now the constraints change. The motor tone cannot be removed at the source, and the team proposes simply raising the sample rate to make the problem go away. Explain when raising fs alone is or is not a real fix, and what additional component is the correct defense regardless of sample rate.",
        rubric: "An excellent answer notes raising fs helps only if you can push Nyquist above ALL real frequency content, including broadband noise and any interference, which is often impractical because real signals and noise extend high. The robust fix is an analog anti-aliasing low-pass filter placed BEFORE the ADC, attenuating everything above the new Nyquist so out-of-band energy cannot fold in. It should mention the filter must be analog/continuous-time (digital filtering after sampling is too late, the alias already collided with the band) and that filter rolloff plus chosen fs set a transition guard band. Key insight: aliasing is created at the moment of sampling, so prevention must happen in continuous time before the ADC; sample rate and anti-alias filter must be designed together.",
      },
    ],
  },
  {
    id: "signals_systems_poles_zeros_stability",
    slug: "concept-signals-systems-poles-zeros-stability",
    title: "What Pole Locations Tell You About Behavior",
    prompt: "You are reviewing a colleague's continuous-time control filter described by its transfer function H(s). They mention that one of the poles has just drifted into the right half of the s-plane after a design tweak, and they are unsure whether to worry.",
    discipline: "ELECTRICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["signals-systems", "conceptual"],
    skillAreas: ["signals-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain what poles and zeros physically mean for a system's behavior, and why a pole in the right half of the s-plane is a serious problem. Connect pole location to the time-domain response (decay vs growth, oscillation).",
        rubric: "An excellent answer explains poles are roots of the denominator (natural modes / where H(s) blows up) and zeros are roots of the numerator (frequencies the system blocks or nulls). Each pole contributes a time-domain mode exp(s_p * t): the real part sets decay or growth and the imaginary part sets oscillation frequency. Left-half-plane poles (negative real part) decay (stable); a right-half-plane pole (positive real part) means a mode that grows without bound, so the response diverges for bounded input. For BIBO stability all poles must lie strictly in the left half plane (poles on the j-omega axis are marginal/oscillatory). Key insight: the real part of each pole is a growth/decay rate, so any pole with positive real part guarantees instability regardless of the input.",
      },
      {
        prompt: "Part 2: Now the constraints change. The colleague says they will instead implement this filter digitally on a microcontroller, so they map H(s) to a discrete transfer function H(z). Restate the stability condition in the z-domain and explain why the boundary changes from an axis to a circle, and what an unstable pole looks like there.",
        rubric: "An excellent answer states that in discrete time, BIBO stability requires all poles of H(z) to lie strictly inside the unit circle (|z| < 1); the unit circle |z| = 1 is the marginal boundary and poles outside it are unstable. It explains the mapping z = exp(s*T) sends the left half s-plane to the interior of the unit circle, the j-omega axis to the unit circle, and the right half plane to outside, so the stable region transforms from a half-plane into a disk. A discrete mode behaves like p^n, so |p| > 1 grows without bound while |p| < 1 decays. Key insight: continuous stability is about the real part being negative (left half plane), discrete stability is about magnitude being less than one (inside the unit circle), and z = exp(sT) is the bridge between the two pictures.",
      },
    ],
  },
  {
    id: "signals_systems_freq_response_filter",
    slug: "concept-signals-systems-freq-response-filter",
    title: "Why Eigenfunctions Make Frequency Response Powerful",
    prompt: "An interviewer asks you to design intuition for an audio equalizer. You claim that for an LTI system, feeding in a pure sinusoid is special: the output is the same sinusoid, just scaled and phase-shifted, never a different waveform.",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["signals-systems", "conceptual"],
    skillAreas: ["signals-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why a sinusoid (or complex exponential) is an eigenfunction of any LTI system, what the frequency response H(j*omega) represents in magnitude and phase, and how this justifies treating filtering as multiplication in the frequency domain.",
        rubric: "An excellent answer explains that complex exponentials exp(j*omega*t) are eigenfunctions of LTI systems: passing one through gives the same exponential scaled by a complex constant H(j*omega), because convolution with exp(j*omega*t) factors out the exponential and integrates the impulse response (H(j*omega) is the Fourier transform of h(t)). The magnitude |H(j*omega)| scales the amplitude at that frequency and the angle of H sets the phase shift; the waveform's frequency is unchanged. This is why Y(j*omega) = H(j*omega)*X(j*omega): convolution in time becomes multiplication in frequency, so a filter just reweights each frequency independently. Key insight: sinusoids survive LTI systems intact because they are eigenfunctions, which is exactly why filtering is per-frequency gain-and-phase rather than waveform reshaping.",
      },
      {
        prompt: "Part 2: Now the constraints change. The interviewer points out that a square wave fed into the same equalizer comes out visibly distorted in shape, with rounded or ringing edges, even though you just claimed LTI systems do not change the waveform. Resolve this apparent contradiction.",
        rubric: "An excellent answer resolves it via Fourier: a square wave is NOT a single sinusoid but a sum of harmonics (fundamental plus odd harmonics with specific amplitudes and phases). The LTI system leaves each individual sinusoid as a sinusoid, but it applies a DIFFERENT magnitude and phase to each harmonic. When the now-reweighted, phase-shifted harmonics recombine, the composite shape changes, hence rounding (high harmonics attenuated) or ringing (phase distortion / passband peaking). No contradiction: per-frequency the claim holds; the shape changes because the mix of frequencies changed. Key insight: LTI preserves each frequency's sinusoidal nature but can alter the relative amplitudes and phases of a signal's components, and waveform shape lives in exactly those relative amplitudes and phases.",
      },
    ],
  },
  {
    id: "signals_systems_time_freq_uncertainty",
    slug: "concept-signals-systems-time-freq-uncertainty",
    title: "The Tradeoff Between Time and Frequency Localization",
    prompt: "A radar engineer wants to know both exactly WHEN an echo arrives and exactly WHAT its frequency is, with arbitrarily fine precision in both at once. They ask you to design a single transmitted pulse that achieves this.",
    discipline: "ELECTRICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["signals-systems", "conceptual"],
    skillAreas: ["signals-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why you cannot make a signal arbitrarily narrow in both time and frequency simultaneously. Use the time-frequency duality of the Fourier transform to justify the tradeoff, with concrete examples at the two extremes.",
        rubric: "An excellent answer states the time-bandwidth tradeoff (a form of the uncertainty principle): the product of a signal's time duration and its frequency bandwidth is bounded below, so shrinking one widens the other (delta_t * delta_f >= a constant). It justifies this with Fourier duality: a very short pulse (approaching an impulse) has a very broad, flat spectrum (all frequencies), while a long pure tone has a very narrow spectrum but is spread out in time; a delta in one domain is a constant in the other. It may cite the Gaussian as the minimum-product shape. Key insight: time concentration and frequency concentration are inversely linked through the Fourier transform, so perfect simultaneous localization in both domains is impossible.",
      },
      {
        prompt: "Part 2: Now the constraints change. The engineer insists they truly need BOTH fine range (time) resolution AND fine velocity (frequency/Doppler) resolution. Given you cannot beat the tradeoff with a simple pulse, explain the conceptual escape and why it works without violating the principle.",
        rubric: "An excellent answer explains that range resolution depends on BANDWIDTH (not raw pulse shortness) and Doppler/frequency resolution depends on total OBSERVATION TIME (not a single narrow tone), so you decouple them by using a long-duration, wide-bandwidth waveform such as a linear FM chirp (or coherent pulse train) plus matched filtering / pulse compression. The long duration gives energy and fine Doppler resolution; the swept bandwidth gives fine range resolution after compression. This does not violate the principle because each individual measurement still obeys delta_t * delta_f bounds; you simply use a large time-bandwidth product (TBP >> 1) signal and process it, rather than one minimal-TBP pulse. Key insight: you cannot cheat the single-pulse tradeoff, but you can independently buy time resolution with bandwidth and frequency resolution with observation time by spreading a high time-bandwidth-product waveform and matched-filtering it.",
      },
    ],
  },
];
