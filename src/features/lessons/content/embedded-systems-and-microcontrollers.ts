import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_embedded",
  slug: "embedded-systems-and-microcontrollers",
  title: "Embedded Systems: The Tiny Computers Running the Physical World",
  summary:
    "There is a computer in your microwave, your car's airbags, your thermostat, and the drone over your head — and almost none of them have a screen or a keyboard. These are embedded systems, and at their heart sits a microcontroller: an entire computer (CPU, memory, and peripherals) on a single chip, talking to the real world through pins, timers, and converters. You will learn the difference between polling and interrupts (and why interrupts are the whole reason embedded systems feel instantaneous), how an ADC turns a voltage into a number with resolution Vref/2^n, and the real-time mindset that separates embedded engineers from app developers.",
  discipline: "MECHATRONICS",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: ["embedded", "microcontroller", "interrupts"],
  objectives: [
    "Describe what an embedded system and a microcontroller are, and identify the CPU, memory, and peripherals integrated on a single chip.",
    "Explain GPIO and the difference between configuring a pin as a digital input versus an output.",
    "Contrast polling with interrupts (ISRs) and explain why interrupts are essential for responsive, power-efficient embedded systems.",
    "Compute ADC resolution (step size / LSB) as Vref/2^n and reason about quantization error.",
    "Choose the number of ADC bits required to meet a target measurement resolution.",
    "Explain the role of timers and PWM, and articulate the real-time mindset of deterministic, deadline-driven code.",
  ],
  prerequisites: [
    "Basic understanding of binary numbers and powers of two",
    "Familiarity with the idea of a CPU executing instructions",
    "Comfort with simple voltage and analog vs digital signal concepts",
  ],
  interviewAngle:
    "Embedded and firmware interviews probe whether you understand the chip talking to the physical world, not just C syntax. The most common conceptual question is polling vs interrupts: strong candidates explain that polling wastes cycles and power and can miss fast events, while an interrupt lets the CPU sleep or do other work and respond the instant something happens — and they can name ISR pitfalls (keep it short, use volatile for shared variables, mind reentrancy). The second staple is the ADC: interviewers expect you to derive resolution as Vref/2^n on the spot and size the bit count for a required precision. Expect follow-ups on timers/PWM, register-level configuration in C, and the real-time mindset — meeting deadlines deterministically. Weak candidates treat a microcontroller like a tiny laptop and forget that memory is tiny, there is often no OS, and every interrupt and every microsecond counts.",
  blocks: [
    {
      id: "emb-hook",
      kind: "PROSE",
      title: "The 250 computers you own and never think about",
      markdown:
        "Quick: how many computers do you own? Most people say one or two — laptop, phone. The real answer is closer to a *few hundred*. There is a computer in your microwave deciding when to stop the magnetron, one in your car firing the airbags within milliseconds of a crash, one in your washing machine, your TV remote, your earbuds, your toothbrush, the smart bulb over your head, and the thermostat on the wall.\n\nThese are **embedded systems**: computers built into a device to do one dedicated job, usually with no monitor, no keyboard, and no \"apps\" — just sensors coming in and actuators going out. They are the overwhelming majority of all computers ever made, and they are invisible precisely because they work.\n\nAt the heart of nearly every one sits a **microcontroller** — and it is genuinely a computer, just shrunk onto a single fingernail-sized chip and pointed at the physical world. Learn how a microcontroller senses voltages, reacts to events the instant they happen, and meets hard deadlines, and you understand the machinery quietly running modern life.",
    },
    {
      id: "emb-video",
      kind: "VIDEO",
      youtubeId: "d82xyDX2DiA",
      title: "Watch: Interrupts in Microcontrollers",
    },
    {
      id: "emb-what-is-mcu",
      kind: "PROSE",
      title: "What's actually on the chip: CPU + memory + peripherals",
      markdown:
        "People mix up *microprocessor* and *microcontroller*, so let's nail it. A **microprocessor** (the chip in your laptop) is essentially just a CPU; it needs external RAM, external storage, and a motherboard full of support chips to do anything. A **microcontroller (MCU)** is a *whole computer on one chip* — designed to be self-contained and cheap, so it can be soldered into a $3 gadget.\n\nThree ingredients live inside that single package:\n\n- **CPU** — the brain that executes instructions, often a modest core (an ARM Cortex-M, an AVR, an RISC-V) running at anywhere from a few MHz to a few hundred MHz. No GHz monsters here; embedded prizes efficiency over raw speed.\n- **Memory** — and it is *tiny*. Program code lives in **Flash** (non-volatile, often kilobytes to a couple megabytes), and working data lives in **SRAM** (volatile, often just a few KB to a few hundred KB). You do not have gigabytes; every byte counts.\n- **Peripherals** — this is the magic. On-chip hardware blocks that talk to the outside world: GPIO pins, analog-to-digital converters (ADCs), timers, PWM generators, and communication interfaces (UART, SPI, I²C). These are why a microcontroller can directly read a sensor or drive a motor without a pile of extra chips.\n\nMost MCUs run with **no operating system at all** — your C code *is* the only thing running, often in a single infinite loop (the \"superloop\"). Some run a tiny real-time OS (RTOS) when juggling many tasks. Either way, you are far closer to the bare metal than any web or app developer ever gets.",
    },
    {
      id: "emb-gpio",
      kind: "PROSE",
      title: "GPIO: the chip's fingers and eyes",
      markdown:
        "The simplest peripheral is **GPIO** — General-Purpose Input/Output — the physical **pins** on the chip that you can control individually. Each pin can be configured (in software, by writing to a register) as either:\n\n- an **input**, to *read* a digital voltage — is this pin HIGH (e.g., 3.3 V, logic 1) or LOW (0 V, logic 0)? This is how you read a button press, a limit switch, or the digital output of a sensor.\n- an **output**, to *drive* a voltage — set the pin HIGH or LOW to turn on an LED, switch a transistor, or signal another chip.\n\nGPIO is digital and binary: on or off, 1 or 0. Blinking an LED — the embedded world's \"Hello, World\" — is nothing more than configuring a pin as output and toggling it HIGH/LOW in a loop with a delay. It feels trivial, but it is the foundation: every digital interaction with the outside world is ultimately reading or writing pins. The subtlety is in *how* you watch an input pin for change — and that brings us to the single most important idea in embedded systems.",
    },
    {
      id: "emb-polling-interrupts",
      kind: "PROSE",
      title: "Polling vs interrupts: the heart of embedded thinking",
      markdown:
        "Suppose you want your microcontroller to react when a button is pressed. There are two fundamentally different ways to do it, and the choice defines how good an embedded engineer you are.\n\n**Polling** is the brute-force way: in your main loop, *constantly check* the button pin. \"Is it pressed? No. Is it pressed now? No. Now? No...\" — millions of times per second, forever. It is the kid in the back seat asking \"are we there yet?\" without pause. Polling works, and it is simple, but it has two ugly costs: the CPU is **100% busy** doing nothing useful (so it can never sleep, burning power), and if the CPU happens to be off doing something else when a brief event occurs, it can **miss it entirely**.\n\n**Interrupts** flip the model around. You tell the hardware: \"watch this pin for me, and when it changes, *stop whatever you're doing and run this function*.\" That function is an **Interrupt Service Routine (ISR)**. Now the CPU is free — it can run other code, or drop into a low-power **sleep** and wake instantly when the event fires. It is the difference between you staring at the mailbox all day versus the mail carrier ringing your doorbell when something arrives.\n\nWhy interrupts matter so much:\n\n- **Responsiveness.** The reaction is near-instantaneous and deterministic, not dependent on where your main loop happens to be.\n- **Efficiency / power.** The CPU sleeps until needed — critical for battery devices that must last months or years.\n- **Never miss fast events.** A 50-microsecond pulse from an encoder or a comparator would be easy to miss while polling; an interrupt catches it every time.\n\nISRs come with rules that interviewers love to ask about: **keep them short** (do the minimum, set a flag, get out — long ISRs block other interrupts), use the **`volatile`** keyword for variables shared between an ISR and main code (so the compiler does not optimize away re-reads), and beware shared-data races, since an ISR can fire in the middle of your main code at any instant.",
    },
    {
      id: "emb-adc",
      kind: "PROSE",
      title: "ADC and DAC: bridging analog and digital, and the resolution number",
      markdown:
        "The real world is **analog** — temperature, light, pressure, sound, a potentiometer's position are all smooth, continuous voltages. But a microcontroller thinks only in **digital** numbers. The bridge is the **ADC (Analog-to-Digital Converter)**: it samples an input voltage and reports an integer. (Going the other way — turning a number back into a voltage, say to generate an audio waveform — is a **DAC**.)\n\nThe key spec of an ADC is its **resolution**, set by the number of bits `n`. An n-bit ADC can represent `2^n` distinct levels, slicing the input range from 0 up to a reference voltage `Vref` into that many steps. The size of one step — the smallest voltage change the ADC can possibly distinguish, called one **LSB** (Least Significant Bit) — is:\n\n`step size = Vref / 2^n`.\n\nSo a 10-bit ADC with a 5 V reference has `2^10 = 1024` levels and a step of `5 / 1024 ≈ 4.88 mV`. Any real voltage gets rounded to the nearest step, and that rounding is **quantization error** — at most half a step. More bits → finer steps → less quantization error → a more precise measurement, but also (usually) slower conversion and more cost. Choosing `n` is a classic engineering trade-off: enough resolution to resolve the smallest change you care about, but no more than you need.",
    },
    {
      id: "emb-formula-adc",
      kind: "FORMULA",
      title: "ADC resolution (step size / LSB)",
      display: "Δ = Vref / 2ⁿ        (levels = 2ⁿ,    max quantization error ≈ Δ/2)",
      latex: "\\Delta = \\dfrac{V_{ref}}{2^{n}} \\qquad \\left(\\text{levels} = 2^{n}, \\quad \\text{max quantization error} \\approx \\dfrac{\\Delta}{2}\\right)",
      variables: [
        { symbol: "Δ", name: "Step size / resolution (voltage of one LSB)", unit: "V" },
        { symbol: "Vref", name: "ADC reference voltage (full-scale input)", unit: "V" },
        { symbol: "n", name: "Number of ADC bits" },
      ],
      note:
        "An n-bit ADC divides the 0-to-Vref range into 2ⁿ levels, so each step (one LSB) is Vref/2ⁿ. Every extra bit halves the step size — doubling resolution. The worst-case quantization (rounding) error is half a step, Δ/2. This same Vref/2ⁿ relationship runs in reverse for a DAC's output step.",
    },
    {
      id: "emb-sandbox-adc",
      kind: "SANDBOX",
      title: "Play: shrink the steps by adding bits",
      description:
        "Drag the reference voltage Vref and the bit count n to watch the ADC step size Vref/2^n. With the defaults (Vref = 5 V, n = 10 bits) you get 5 / 1024 ≈ 0.00488 V — about 4.88 mV per step. Add one bit (n = 11) and watch the step size *halve*: every bit doubles your resolution. Lower the reference voltage and the steps shrink too (you're spreading fewer volts across the same number of levels), which is one trick for measuring small signals precisely.",
      variables: [
        { key: "Vref", label: "ADC reference voltage", unit: "V", min: 1, max: 5, step: 0.1, default: 5 },
        { key: "n", label: "ADC bits", unit: "", min: 8, max: 16, step: 1, default: 10 },
      ],
      expression: "Vref / 2 ^ n",
      outputLabel: "ADC step size (LSB)",
      outputUnit: "V",
      precision: 5,
    },
    {
      id: "emb-predict-bits",
      kind: "PREDICT",
      question:
        "Your 10-bit ADC with a 5 V reference gives a step size of about 4.88 mV, but you need finer resolution. You upgrade to a 12-bit ADC, same 5 V reference. What happens to the step size?",
      options: [
        { id: "a", label: "It drops by a little — about 20% smaller." },
        { id: "b", label: "It shrinks to about one-quarter, roughly 1.22 mV." },
        { id: "c", label: "It doubles to about 9.76 mV — more bits, bigger steps." },
        { id: "d", label: "It stays the same; bits don't affect step size." },
      ],
      answerId: "b",
      reveal:
        "**About one-quarter the size, ~1.22 mV.** Each extra bit *doubles* the number of levels and therefore *halves* the step size. Going from 10 to 12 bits is two extra bits, so the step shrinks by a factor of 2 × 2 = 4: `5 / 2^12 = 5 / 4096 ≈ 1.22 mV`. This is the exponential power of bits — resolution improves geometrically, not linearly, which is exactly why adding even a couple of bits makes such a dramatic difference (and why the cost/speed penalty of high-bit ADCs is worth weighing).",
    },
    {
      id: "emb-predict-interrupt",
      kind: "PREDICT",
      question:
        "A battery-powered sensor must run for two years on a coin cell and wake up only when a button is pressed. The first design polls the button in a tight loop. What's the most likely problem?",
      options: [
        { id: "a", label: "Polling is fine — it's the most power-efficient approach." },
        { id: "b", label: "The CPU never sleeps, draining the battery in days instead of years." },
        { id: "c", label: "Polling is too slow to ever detect a button press." },
        { id: "d", label: "The button needs an ADC, not GPIO." },
      ],
      answerId: "b",
      reveal:
        "**The CPU never sleeps, so the battery dies fast.** A polling loop keeps the processor running at full tilt around the clock just to ask \"pressed yet?\" — that constant current draw is fatal for a coin-cell device meant to last years. The right design uses a **pin-change interrupt**: configure the button pin to trigger an ISR, then put the MCU into a deep-sleep mode where it draws microamps. The hardware watches the pin while the CPU is essentially off, and the press wakes it instantly. This is *the* canonical reason interrupts exist — responsiveness *and* power efficiency, neither of which polling can deliver.",
    },
    {
      id: "emb-timers-pwm",
      kind: "PROSE",
      title: "Timers and PWM: keeping time and faking analog out",
      markdown:
        "Two more peripherals show up in almost every embedded design, and they are deeply related.\n\nA **timer** is a hardware counter that ticks at a known rate derived from the system clock. Because it runs *in hardware, independent of the CPU*, it keeps perfect time even while your code is busy — and it can fire an interrupt when it reaches a set value. Timers are how you do anything periodic with precision: sample a sensor exactly every millisecond, debounce a button, generate a baud-rate clock, or build a real-time scheduler. \"Run this task every 10 ms\" almost always means \"configure a timer to interrupt every 10 ms.\"\n\n**PWM (Pulse-Width Modulation)** is the timer's most beloved trick. A digital pin can only be fully ON or fully OFF — but if you switch it on and off very fast and vary the *fraction* of time it spends ON (the **duty cycle**), the *average* voltage lands anywhere in between. Drive an LED at 25% duty cycle and it looks dimmed; drive a motor at 75% and it spins at roughly three-quarters speed; feed PWM through a filter and you get a crude DAC. It is how a chip with only digital outputs produces smoothly variable power — dimming lights, controlling motor speed, positioning servos — all from a timer counting very, very fast.",
    },
    {
      id: "emb-realtime",
      kind: "PROSE",
      title: "The real-time mindset: deadlines, determinism, and the bare metal",
      markdown:
        "What truly separates embedded engineering from app or web development is the **real-time mindset**. On your laptop, if a task takes 50 ms longer than expected, nobody notices. In embedded, *late can be catastrophically wrong*: an airbag controller that fires 100 ms late is useless; a motor controller that misses its update slot makes the motor jerk; an audio system that misses a sample produces an audible glitch.\n\nReal-time does not mean *fast* — it means **deterministic** and **deadline-driven**. A correct embedded system produces the right result *at the right time, every time*. This shapes everything:\n\n- **Worst-case matters more than average.** You care about the *longest* an operation could ever take, because that is what blows a deadline.\n- **Keep ISRs short.** A long interrupt handler delays every other deadline in the system.\n- **Avoid unpredictable operations** in time-critical paths — dynamic memory allocation, unbounded loops, and anything with variable latency are suspect.\n\nAnd you do all this close to the **bare metal**, almost always in **C** (sometimes C++ or Rust). You frequently configure peripherals by writing directly to **hardware registers** — specific memory addresses where each bit controls a piece of hardware (set bit 5 of this register to enable the ADC, write this value to set a timer's period). There is often no OS, no `malloc` to lean on, kilobytes of RAM, and no debugger console — just you, the datasheet, and a chip that does *exactly* what your bits tell it to. That intimacy with the hardware is the whole appeal.",
    },
    {
      id: "emb-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: sizing an ADC and bounding its error",
      problem:
        "You are measuring a temperature sensor whose output spans 0 to 5 V, and your microcontroller's ADC uses a Vref of 5 V. (a) Find the step size of a 10-bit ADC. (b) Find the worst-case quantization error for that 10-bit reading. (c) Your spec requires you to resolve voltage changes of at least 2 mV. Does 10 bits suffice? If not, what's the minimum number of bits?",
      steps: [
        {
          label: "(a) Step size at 10 bits",
          markdown:
            "A 10-bit ADC has `2^10 = 1024` levels across the 0-to-5 V range. Step size Δ = Vref / 2^n = 5 / 1024 ≈ **0.00488 V**, or about **4.88 mV** per step.",
        },
        {
          label: "(b) Worst-case quantization error",
          markdown:
            "Any analog voltage is rounded to the nearest step, so the largest possible error is half a step: Δ/2 = 4.88 mV / 2 ≈ **2.44 mV**. No matter how perfect the rest of the circuit, a 10-bit reading on this range can be off by up to ~2.44 mV purely from quantization.",
        },
        {
          label: "(c) Check against the 2 mV requirement",
          markdown:
            "We need the *step size* to be ≤ 2 mV. At 10 bits the step is 4.88 mV — **too coarse**. Add bits and watch the step halve: 11 bits → 5/2048 ≈ 2.44 mV (still > 2 mV); 12 bits → 5/4096 ≈ 1.22 mV (now ≤ 2 mV). So **12 bits** is the minimum that meets the spec.",
        },
        {
          label: "Sanity check the trade-off",
          markdown:
            "Going to 12 bits quadrupled the level count (1024 → 4096) and cut quantization error to ~0.61 mV worst case — comfortably under requirement. The cost is typically a slower conversion and a pricier part, and at this fine a resolution you would also need to make sure circuit noise is below ~1 mV, or the extra bits just digitize noise.",
        },
      ],
      answer:
        "(a) Δ = 5/1024 ≈ 4.88 mV. (b) Worst-case quantization error ≈ Δ/2 ≈ 2.44 mV. (c) 10 bits (4.88 mV step) is too coarse for a 2 mV requirement; you need 12 bits (5/4096 ≈ 1.22 mV step).",
    },
    {
      id: "emb-check-interrupt",
      kind: "CHECK",
      question:
        "Why is an interrupt generally preferred over polling for detecting a brief, infrequent external event on a microcontroller?",
      choices: [
        { id: "a", label: "Interrupts run the CPU faster than polling does." },
        { id: "b", label: "Polling can't read digital pins; only interrupts can." },
        { id: "c", label: "An interrupt lets the CPU do other work or sleep and respond instantly when the event fires, instead of wasting cycles constantly checking." },
        { id: "d", label: "Interrupts use less memory because they don't need any code." },
      ],
      answerId: "c",
      explanation:
        "The core advantage is efficiency and responsiveness: with an interrupt, the hardware watches the pin while the **CPU is free** to do other work or drop into low-power sleep, then it reacts the instant the event occurs and never misses a brief pulse. Polling, by contrast, burns the CPU continuously asking \"is it ready yet?\" and can miss fast events. Interrupts do not change the clock speed (a), polling can absolutely read pins (b), and ISRs are very much code — they just are not always executing (d).",
    },
    {
      id: "emb-check-adc",
      kind: "CHECK",
      question:
        "An 8-bit ADC with a 3.3 V reference is being used. What is its approximate step size (resolution)?",
      choices: [
        { id: "a", label: "About 12.9 mV (3.3 V / 256)." },
        { id: "b", label: "About 3.3 mV (3.3 V / 1000)." },
        { id: "c", label: "About 412 mV (3.3 V / 8)." },
        { id: "d", label: "About 0.81 mV (3.3 V / 4096)." },
      ],
      answerId: "a",
      explanation:
        "Step size is Vref / 2^n. An 8-bit ADC has 2^8 = 256 levels, so Δ = 3.3 / 256 ≈ **12.9 mV**. Option (c) wrongly divides by the number of bits (8) instead of the number of *levels* (2^8) — a classic trap. Option (d) is the 12-bit answer (2^12 = 4096), and (b) does not correspond to any power of two. The takeaway: always divide the reference by 2^n, the level count, not by n.",
    },
    {
      id: "emb-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What embedded interviewers actually grill you on",
      markdown:
        "Firmware interviews reward people who think about the chip and the clock, not just the code. To shine:\n\n- **Own polling vs interrupts.** Explain that interrupts free the CPU (work or sleep), react instantly, and never miss fast events, while polling wastes power and can drop brief pulses. This is the single most-asked embedded concept.\n- **Know ISR rules cold.** Keep ISRs short (set a flag and exit), use **`volatile`** for variables shared with the ISR, and watch for race conditions on shared data. Mentioning `volatile` unprompted is a strong signal.\n- **Derive Vref/2ⁿ live.** Be ready to compute ADC step size and *size the bits* for a target resolution — and remember it is divided by 2ⁿ (levels), never by n.\n- **Respect the constraints.** Talk about tiny RAM, no OS or a small RTOS, no dynamic allocation in critical paths, and register-level configuration in C. Treating an MCU like a laptop is a red flag.\n- **Frame real-time correctly.** Real-time means *deterministic and meeting deadlines*, not merely fast — worst-case timing is what matters.",
    },
    {
      id: "emb-callout-tip",
      kind: "CALLOUT",
      variant: "tip",
      title: "Fast reflexes for any embedded question",
      markdown:
        "A handful of reflexes will carry you through most embedded problems:\n\n- **Reacting to an event?** Default to an **interrupt**, not a poll — and keep the ISR tiny.\n- **ADC math?** Step size = Vref / 2^n; every extra bit *halves* the step; worst-case error is half a step.\n- **Need smooth output from a digital pin?** Reach for **PWM** and vary the duty cycle.\n- **Need precise timing?** Use a hardware **timer**, not a software delay loop — timers keep ticking regardless of what the CPU is doing.\n- **Sharing data between an ISR and main code?** Mark it **`volatile`** and guard against the ISR firing mid-update.\n\nAnd always ask the real-time question: what is the *worst-case* time this could take, and does it still meet the deadline?",
    },
    {
      id: "emb-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "One picture to carry away",
      markdown:
        "A microcontroller is a whole computer — CPU, a little memory, and a toolbox of peripherals — on one chip, pointed at the physical world. It reads and writes the world through GPIO pins, turns analog into numbers with an ADC at resolution Vref/2^n, generates timing and smooth output with timers and PWM, and — crucially — reacts to events through **interrupts** so it can stay responsive and asleep until needed. Wrap all of that in a real-time mindset where meeting the deadline *every time* matters more than raw speed, write it close to the bare metal in C, and you have the recipe running a few hundred invisible computers in every modern life.",
    },
  ],
  keyTakeaways: [
    "An embedded system is a computer dedicated to one job inside a device; at its core is a microcontroller — a full computer (CPU, memory, and peripherals) integrated on a single chip, usually with no OS and very little RAM.",
    "GPIO pins are the chip's digital interface to the world: configured as inputs to read HIGH/LOW voltages (buttons, sensors) or as outputs to drive devices (LEDs, transistors).",
    "Interrupts beat polling for events because the CPU can do other work or sleep and respond the instant an event fires, never missing fast pulses, whereas polling wastes cycles and power and can miss events.",
    "ISRs must be kept short, share data with main code via volatile variables, and be written carefully to avoid race conditions, since they can preempt the main program at any moment.",
    "An ADC converts analog voltages to numbers with step size (resolution) Δ = Vref/2^n; each extra bit halves the step, and the worst-case quantization error is half a step (Δ/2).",
    "Timers are hardware counters that keep precise time independent of the CPU and can fire interrupts; PWM uses a timer to vary a digital pin's duty cycle and so produce a variable average voltage for dimming, motor speed, and servos.",
    "The real-time mindset means deterministic, deadline-driven code where worst-case timing matters most — written close to the bare metal in C, often by configuring hardware registers directly.",
  ],
};
