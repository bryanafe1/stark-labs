import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_sensors",
  slug: "sensors-and-actuators",
  title: "Sensors and Actuators: How Machines Feel and Move",
  summary:
    "Every robot, smart thermostat, and self-driving car runs the same humble loop: sense the world, decide what to do, then act on it. Sensors are the nerve endings that turn temperature, force, and motion into voltages a chip can read; actuators are the muscles that turn voltages back into heat, torque, and motion. You will meet the workhorse sensors (RTDs, thermocouples, strain gauges, encoders, IMUs), learn why a raw signal is almost never usable until you amplify and filter it, and walk away able to convert a platinum sensor's resistance into a real temperature in your head.",
  discipline: "MECHATRONICS",
  difficulty: "MEDIUM",
  estMinutes: 22,
  tags: ["sensors", "actuators", "signal-conditioning"],
  objectives: [
    "Define sensors as transducers that convert a physical quantity into an electrical signal, and actuators as the reverse.",
    "Identify the common sensors (RTD, thermocouple, strain gauge, encoder, IMU) and the physical quantity each one measures.",
    "Explain transduction and calibration in terms of sensitivity, offset, and linearity.",
    "Describe why signal conditioning (amplification and filtering) is needed before a raw sensor signal can be used.",
    "Match actuator types (DC, stepper, servo motors, solenoids) to the motion or force a task requires.",
    "Trace the sense → decide → act feedback loop and place each component in it.",
  ],
  prerequisites: [
    "Basic electricity: voltage, current, and resistance (Ohm's law)",
    "Comfort with linear equations of the form y = m·x + b",
    "A rough idea of what a microcontroller does",
  ],
  interviewAngle:
    "Sensors-and-actuators questions are the bread and butter of mechatronics, robotics, and embedded interviews because they test whether you can reason about the whole signal chain, not just memorize part names. Interviewers love to hand you a task — \"measure the temperature of an engine,\" \"position a camera gimbal,\" \"detect a button press\" — and watch how you pick a transducer, justify it against alternatives, and then explain what has to happen between the sensor and the chip (amplify, filter, linearize, calibrate). Strong candidates talk in terms of sensitivity, offset, linearity, and noise; they know an RTD is more linear than a thermocouple but a thermocouple survives higher temperatures; they can explain why an encoder gives you position while an IMU gives you acceleration and rotation; and they distinguish open-loop steppers from closed-loop servos. Weak candidates name a part and stop, with no sense of the conditioning and calibration that make a raw signal trustworthy.",
  blocks: [
    {
      id: "sa-hook",
      kind: "PROSE",
      title: "The two organs every machine needs",
      markdown:
        "Pinch your finger and you yank it back before you have even finished thinking the word \"ow.\" Nerves *sensed* the pressure, your spinal cord *decided*, and muscles *acted* — all in a fraction of a second. Strip away the biology and you have just described every robot, every drone, every smart appliance ever built.\n\nMachines feel the world through **sensors** and move through it with **actuators**. A thermostat *senses* room temperature and *acts* by switching on a heater. A drone *senses* its tilt with a tiny motion chip and *acts* by spinning four motors at slightly different speeds. A car's airbag *senses* a sudden deceleration and *acts* by firing an inflator in milliseconds.\n\nHere is the thing that surprises people: the sensor never actually hands the computer a \"temperature.\" It hands over a *voltage*, or a *resistance*, or a stream of pulses — a physical stand-in that the system has to decode, clean up, and trust. That translation, from physics to numbers and back to physics, is the entire craft of mechatronics. Master the chain and you can build a machine that touches the real world. Let's build it piece by piece.",
    },
    {
      id: "sa-video",
      kind: "VIDEO",
      youtubeId: "bcqzdw29tC0",
      title: "Watch: Understanding Sensors and Actuators",
    },
    {
      id: "sa-transducer",
      kind: "PROSE",
      title: "Transducers: physics in, electricity out (and back)",
      markdown:
        "The word that ties everything together is **transducer** — a device that converts energy from one form into another. Both sensors and actuators are transducers; they just point in opposite directions.\n\n- A **sensor** converts a *physical* quantity (temperature, force, light, position, acceleration) into an *electrical* signal a chip can read. Physics in, voltage out.\n- An **actuator** converts an *electrical* signal back into a *physical* effect (motion, heat, force, sound). Voltage in, physics out.\n\nThink of them as translators sitting on either side of a digital brain that only speaks numbers. The world speaks \"23 °C\" and \"0.4 newtons\"; the microcontroller speaks bits. Sensors translate the world *into* the chip's language; actuators translate the chip's commands back *out* into the world.\n\nA few quick examples to anchor it:\n\n- A **thermistor** changes its resistance as it heats up — temperature becomes resistance becomes a measurable voltage.\n- A **microphone** turns sound-pressure waves into a wiggling voltage (sensor); a **speaker** does the exact reverse (actuator).\n- A **photodiode** turns light into current; an **LED** turns current into light.\n\nNotice the symmetry — many sensor/actuator pairs are literally the same physics run backward. That is not a coincidence; it is the whole idea of a transducer.",
    },
    {
      id: "sa-common-sensors",
      kind: "PROSE",
      title: "The sensor zoo: who measures what",
      markdown:
        "You do not need to memorize a catalog, but a handful of sensors show up everywhere, and knowing what each one measures (and its quirks) is exactly what an interviewer probes.\n\n- **RTD (Resistance Temperature Detector)** — a coil of pure metal, usually platinum, whose resistance rises predictably with temperature. The classic **PT100** reads ~100 Ω at 0 °C. RTDs are prized for being **very linear and accurate**, but they are slower and pricier than the alternatives.\n- **Thermocouple** — two different metals joined at a tip; the junction generates a tiny voltage that depends on temperature (the Seebeck effect). They are **cheap, rugged, and survive extreme heat** (think furnaces, jet engines), but they are less linear and output only millivolts, so they need serious amplification.\n- **Strain gauge** — a foil pattern whose resistance changes a hair when stretched or squeezed. Glue one to a beam and you can measure **force, weight, or pressure** (it is the heart of every digital scale and load cell).\n- **Encoder** — measures **rotational position or speed** by counting marks on a disk (optical) or magnetic poles. It is how a motor controller knows *exactly* where the shaft is.\n- **IMU (Inertial Measurement Unit)** — a chip combining an **accelerometer** (linear acceleration, including gravity) and a **gyroscope** (rotation rate), often plus a magnetometer. This is the tiny brain that tells a phone which way is up and keeps a drone level.\n\nA pattern worth noticing: temperature sensors trade accuracy against ruggedness and range, while motion sensors split into \"where am I\" (encoder) versus \"how am I moving\" (IMU). Pick based on the quantity you actually need.",
    },
    {
      id: "sa-formula-rtd",
      kind: "FORMULA",
      title: "Reading temperature from an RTD",
      display: "T = (R − R0) / (R0 · α)",
      variables: [
        { symbol: "T", name: "Temperature", unit: "°C" },
        { symbol: "R", name: "Measured resistance of the RTD", unit: "Ω" },
        { symbol: "R0", name: "Resistance at 0 °C (100 Ω for a PT100)", unit: "Ω" },
        { symbol: "α", name: "Temperature coefficient of resistance", unit: "1/°C" },
      ],
      note:
        "This is the linear model of an RTD: resistance rises in proportion to temperature. For a platinum PT100, R0 = 100 Ω and α ≈ 0.00385 /°C. Rearranged from R = R0·(1 + α·T), this is the calibration equation — it turns the raw resistance the sensor gives you into the temperature you actually wanted.",
    },
    {
      id: "sa-sandbox-rtd",
      kind: "SANDBOX",
      title: "Play: turn resistance into temperature",
      description:
        "You measured the RTD's resistance R. Drag the sliders to convert it into a temperature using T = (R − R0)/(R0·α). With the PT100 defaults (R = 110 Ω, R0 = 100 Ω, α = 0.00385 /°C) you get T = 10 / 0.385 ≈ 26.0 °C. Bump R up and the temperature rises; nudge α and watch how the sensor's sensitivity changes the reading for the very same resistance.",
      variables: [
        { key: "R", label: "Measured resistance R", unit: "Ω", min: 80, max: 140, step: 0.1, default: 110 },
        { key: "R0", label: "Resistance at 0°C R0", unit: "Ω", min: 90, max: 110, step: 1, default: 100 },
        { key: "alpha", label: "Temp coefficient α", unit: "1/°C", min: 0.003, max: 0.004, step: 0.00001, default: 0.00385 },
      ],
      expression: "(R - R0) / (R0 * alpha)",
      outputLabel: "Temperature",
      outputUnit: "°C",
      precision: 1,
    },
    {
      id: "sa-calibration",
      kind: "PROSE",
      title: "Calibration: sensitivity, offset, and linearity",
      markdown:
        "A raw sensor reading is meaningless until you know how to map it onto real-world units. That map is **calibration**, and for a well-behaved sensor it looks like the equation of a line, `output = sensitivity · input + offset`. Three properties describe how good that map is:\n\n- **Sensitivity** is the *slope* — how much the output changes per unit of input. For our PT100, sensitivity is `R0·α ≈ 0.385 Ω per °C`. A high-sensitivity sensor gives a big, easy-to-read swing for a small change; a low-sensitivity sensor makes the electronics work harder to see anything.\n- **Offset (or bias)** is the *intercept* — the reading you get when the true input is zero. A scale that shows 0.2 kg with nothing on it has an offset, and you \"tare\" it to subtract that bias out.\n- **Linearity** is how *straight* the real curve is. The line is an approximation; real sensors bend away from it, and the worst-case deviation is the linearity error. An RTD is famously linear (the line fits well across a wide range); a thermocouple curves noticeably, which is why its readings need a correction table or polynomial.\n\nCalibration is just *measuring* these for your specific sensor — put it at two or more known inputs, read the outputs, and solve for slope and intercept. Skip it and you are guessing. Every trustworthy instrument on Earth has been calibrated against a reference, and good ones are re-calibrated on a schedule because sensitivity and offset *drift* with age and temperature.",
    },
    {
      id: "sa-predict-sensitivity",
      kind: "PREDICT",
      question:
        "Two temperature sensors are identical except sensor A has twice the sensitivity (slope) of sensor B. For the same 1 °C change in temperature, what happens to the electrical output?",
      options: [
        { id: "a", label: "Sensor A's output changes twice as much as sensor B's." },
        { id: "b", label: "Sensor A's output changes half as much as sensor B's." },
        { id: "c", label: "Both change by the same amount — sensitivity only affects offset." },
        { id: "d", label: "Neither changes; sensitivity only matters at zero." },
      ],
      answerId: "a",
      reveal:
        "**Sensor A swings twice as far.** Sensitivity *is* the slope of the output-vs-input line, so double the sensitivity means double the output change per degree. That is usually a good thing: a larger signal is easier to measure and harder for noise to swamp, which is why engineers often pick higher-sensitivity sensors (or amplify a weak one). The catch is range — a steeper slope can run the signal off the top of your measurement range sooner, so sensitivity is a trade-off, not a free win.",
    },
    {
      id: "sa-signal-conditioning",
      kind: "PROSE",
      title: "Signal conditioning: nobody reads a raw sensor",
      markdown:
        "Here is a secret that catches newcomers off guard: you almost never wire a sensor straight to a microcontroller. The raw signal is usually too weak, too noisy, or the wrong shape to digitize cleanly. The cleanup stage in between is called **signal conditioning**, and it mostly comes down to two jobs.\n\n**Amplification.** A thermocouple might output *microvolts to millivolts* — far below what an analog-to-digital converter (ADC) can resolve. An amplifier (typically an op-amp circuit) multiplies that tiny signal up to a healthy range, say 0–5 V, so the ADC can actually see it. Strain gauges have the same problem; their resistance changes by a fraction of a percent, so they sit in a **Wheatstone bridge** that converts the change into a small voltage, which is then amplified.\n\n**Filtering.** Real signals are buried in noise — 50/60 Hz pickup from power lines, high-frequency hash from nearby motors, random jitter. A **low-pass filter** lets the slow, meaningful signal through and blocks the fast noise; you would use one on a temperature reading that changes over seconds. A **high-pass** or **band-pass** filter keeps only a band you care about. Filtering is also essential before sampling: you must remove frequencies above half your sampling rate or they fold back as fake \"aliased\" signals.\n\nOther conditioning steps you will meet: **level shifting** (moving a signal into the ADC's input window), **linearization** (correcting a curved response, like a thermocouple's), and **isolation** (protecting the electronics from high voltages). The mantra: amplify it so you can see it, filter it so you can trust it, then digitize it.",
    },
    {
      id: "sa-actuators",
      kind: "PROSE",
      title: "Actuators: the muscles",
      markdown:
        "Once the system has *decided* something, an **actuator** makes it happen in the physical world. The most common families:\n\n- **DC motor** — simple, cheap, spins fast and continuously; speed roughly tracks the voltage you apply. Great for wheels and fans, but on its own it has no idea where it is — you cannot tell it \"rotate 90°\" without adding a sensor.\n- **Stepper motor** — moves in fixed, discrete steps (e.g. 1.8° each). You can command an exact number of steps and it lands on position **open-loop** (no feedback needed), which is why 3D printers and CNC machines love them. The catch: if it is overloaded it can silently *skip* steps and lose its place, and it draws full current even while holding still.\n- **Servo motor** — a motor bundled with a position sensor and a built-in controller, so it drives to a *commanded angle* and *holds it*, correcting against disturbances. This is **closed-loop** control in a box — exactly what you want for a robot joint or a camera gimbal.\n- **Solenoid** — an electromagnet that yanks a plunger when energized: it is essentially a digital on/off muscle. Perfect for latches, valves, and door locks where you just need \"open\" or \"closed.\"\n\nThe selection logic mirrors the sensor side: match the actuator to the *motion* you need. Continuous spinning with no positioning → DC motor. Precise repeatable positioning on a budget, modest load → stepper. Accurate, disturbance-rejecting positioning under load → servo. Simple binary push or pull → solenoid.",
    },
    {
      id: "sa-formula-loop",
      kind: "FORMULA",
      title: "The sense → decide → act loop",
      display: "world → [SENSOR] → condition → [CONTROLLER decides] → [ACTUATOR] → world (repeat)",
      variables: [
        { symbol: "SENSOR", name: "Transducer: physical quantity → electrical signal" },
        { symbol: "condition", name: "Amplify, filter, calibrate the raw signal" },
        { symbol: "CONTROLLER", name: "Microcontroller compares to a target and decides" },
        { symbol: "ACTUATOR", name: "Transducer: electrical command → physical effect" },
      ],
      note:
        "This is the heartbeat of every mechatronic system. The sensor and actuator are the transducers at the two boundaries with the physical world; conditioning and the controller live in the electrical middle. Because the loop repeats, the system continuously corrects itself — the act changes the world, the sensor sees the change, and around it goes.",
    },
    {
      id: "sa-predict-actuator",
      kind: "PREDICT",
      question:
        "You are designing a low-cost 3D printer and need the print head to move to precise, repeatable X-Y positions under light load, without the cost of a feedback sensor on each axis. Which actuator fits best?",
      options: [
        { id: "a", label: "A plain DC motor — it's the cheapest spinning option." },
        { id: "b", label: "A stepper motor — it moves in exact discrete steps open-loop." },
        { id: "c", label: "A solenoid — it gives precise positioning." },
        { id: "d", label: "An industrial servo with an encoder on every axis." },
      ],
      answerId: "b",
      reveal:
        "**A stepper motor.** It moves in fixed, countable steps, so you can command an exact position *without* a feedback sensor — open-loop precision on a budget, which is exactly why hobby 3D printers and small CNC machines are full of them. A plain DC motor (a) spins but has no inherent position sense. A solenoid (c) only does on/off, not continuous positioning. A full servo with encoders (d) would absolutely work and reject disturbances better, but it is overkill and over-budget for a light-load printer — the classic interview point is matching the actuator to the requirement, not reaching for the fanciest one.",
    },
    {
      id: "sa-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: read an RTD, then choose a sensor",
      problem:
        "(a) A PT100 RTD (R0 = 100 Ω, α = 0.00385 /°C) measures a resistance of 119.4 Ω. What temperature is it reading? (b) You must continuously measure the temperature inside a 900 °C industrial furnace and report it to a microcontroller. Choose a sensor and outline the signal chain to the chip.",
      steps: [
        {
          label: "(a) Write the conversion",
          markdown:
            "The RTD's linear model rearranges to `T = (R − R0) / (R0 · α)`. We know R = 119.4 Ω, R0 = 100 Ω, and α = 0.00385 /°C.",
        },
        {
          label: "(a) Plug in and solve",
          markdown:
            "Numerator: `R − R0 = 119.4 − 100 = 19.4 Ω`. Denominator: `R0 · α = 100 × 0.00385 = 0.385 Ω/°C`. So `T = 19.4 / 0.385 ≈ 50.4 °C`. The 0.385 Ω/°C in the denominator is the sensor's **sensitivity** — every degree adds about a third of an ohm.",
        },
        {
          label: "(b) Pick the sensor",
          markdown:
            "An RTD tops out around 600 °C and 900 °C would destroy it, so reach for a **thermocouple** (e.g. a Type K, good to ~1260 °C). It is rugged, cheap, and handles the heat — exactly the trade we discussed: you give up some linearity to survive the environment.",
        },
        {
          label: "(b) Build the signal chain",
          markdown:
            "The thermocouple outputs only **millivolts**, so: (1) **amplify** that tiny signal with an instrumentation amplifier up to a few volts; (2) **filter** with a low-pass to kill 50/60 Hz and motor noise (furnace temperature changes slowly, so a low cutoff is fine); (3) **linearize / cold-junction compensate** — a thermocouple's curve bends and its reading depends on the reference-junction temperature, so apply the correction (often a dedicated chip does steps 1–3); (4) feed the clean voltage into the microcontroller's **ADC**. Now the chip has a trustworthy number.",
        },
      ],
      answer:
        "(a) T = (119.4 − 100) / (100 × 0.00385) = 19.4 / 0.385 ≈ 50.4 °C. (b) Use a thermocouple (RTD can't survive 900 °C); chain it through amplify → filter → linearize/cold-junction-compensate → ADC into the microcontroller.",
    },
    {
      id: "sa-check-transducer",
      kind: "CHECK",
      question:
        "Which statement correctly distinguishes a sensor from an actuator?",
      choices: [
        { id: "a", label: "A sensor converts a physical quantity into an electrical signal; an actuator converts an electrical signal into a physical effect." },
        { id: "b", label: "A sensor converts electricity into motion; an actuator measures temperature." },
        { id: "c", label: "Both convert electrical signals into other electrical signals; only the labels differ." },
        { id: "d", label: "A sensor is always digital and an actuator is always analog." },
      ],
      answerId: "a",
      explanation:
        "Both are transducers, but they point opposite directions. A **sensor** takes a physical quantity (temperature, force, position) and produces an electrical signal the system can read; an **actuator** takes an electrical command and produces a physical effect (motion, heat, force). Option b reverses them, c ignores the physical-world boundary that is the whole point, and d invents a digital/analog rule that does not exist — plenty of sensors are analog and plenty of actuators are driven by digital signals.",
    },
    {
      id: "sa-check-conditioning",
      kind: "CHECK",
      question:
        "A strain-gauge load cell produces a signal that changes by only a few millivolts across its full weight range, and the reading flickers with electrical noise from a nearby motor. What does the signal chain most need before the ADC?",
      choices: [
        { id: "a", label: "Nothing — wire it straight to the ADC; millivolts are fine." },
        { id: "b", label: "Amplification to boost the tiny signal, plus low-pass filtering to reject the motor noise." },
        { id: "c", label: "A stepper motor to stabilize the reading." },
        { id: "d", label: "Higher supply voltage to the microcontroller." },
      ],
      answerId: "b",
      explanation:
        "This is textbook **signal conditioning**: a few-millivolt signal is far too small for an ADC to resolve well, so you **amplify** it (a load cell's tiny bridge output typically goes through an instrumentation amplifier) into a usable range. The motor noise is high-frequency relative to a slowly changing weight, so a **low-pass filter** lets the real signal through and blocks the hash. Option a ignores both problems, an actuator (c) does nothing for a measurement, and bumping the MCU supply (d) does not help a weak, noisy sensor signal.",
    },
    {
      id: "sa-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What interviewers actually want to hear",
      markdown:
        "Sensor/actuator questions are really *systems-thinking* questions in disguise. Score points by reasoning across the whole chain:\n\n- **Name the quantity first.** When handed a task, say what you are measuring or moving before you name a part. \"I need *rotational position*, so an **encoder**\" beats blurting a part number.\n- **Justify against the alternative.** \"RTD for accuracy and linearity, *but* a thermocouple here because it survives 900 °C.\" Trade-offs are the whole exam.\n- **Talk the conditioning chain unprompted.** Mention amplification for weak signals (thermocouples, strain gauges) and filtering for noise. Saying \"I would not wire that straight to the ADC\" instantly signals real experience.\n- **Use the vocabulary precisely.** Sensitivity (slope), offset (bias/tare), linearity, calibration, aliasing. Drop these naturally and correctly.\n- **Distinguish open-loop from closed-loop actuation.** Stepper = open-loop position; servo = closed-loop with built-in feedback. Knowing *why* steppers can skip steps under load is a green flag.\n- **Close the loop.** Frame your answer as sense → condition → decide → act, and note that the act changes the world the sensor re-measures. That framing is exactly what they are listening for.",
    },
    {
      id: "sa-callout-tip",
      kind: "CALLOUT",
      variant: "tip",
      title: "A picking guide that fits on a sticky note",
      markdown:
        "When you need to choose, ask *what physical quantity* and *what conditions*:\n\n- **Temperature, accurate & moderate range?** → RTD (PT100). **Extreme heat or cheap & rugged?** → thermocouple (amplify the millivolts).\n- **Force / weight / pressure?** → strain gauge in a Wheatstone bridge (then amplify).\n- **Where is the shaft?** → encoder. **How is the body moving / tilting?** → IMU.\n- **Spin continuously, cheap?** → DC motor. **Precise position, light load, no feedback budget?** → stepper. **Precise position under load, must hold against disturbance?** → servo. **On/off push or latch?** → solenoid.\n\nAnd the universal reflex: a weak signal needs **amplifying**, a noisy signal needs **filtering**, and *every* sensor needs **calibrating** before you believe it.",
    },
    {
      id: "sa-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "One sentence to carry away",
      markdown:
        "A mechatronic system is a loop of transducers — sensors translate the physical world into electrical signals, those signals get amplified, filtered, and calibrated into trustworthy numbers, a controller decides, and actuators translate the decision back into motion, heat, or force that changes the world the sensor sees next. Learn to reason across that whole chain — quantity, conditioning, calibration, actuation — and you can build a machine that genuinely feels and moves.",
    },
  ],
  keyTakeaways: [
    "Sensors and actuators are both transducers: a sensor converts a physical quantity into an electrical signal, and an actuator converts an electrical signal into a physical effect — the two boundaries between a chip and the real world.",
    "Common sensors map to specific quantities: RTD and thermocouple (temperature), strain gauge (force/weight/pressure), encoder (rotational position/speed), and IMU (acceleration and rotation) — each with trade-offs in accuracy, range, and ruggedness.",
    "A calibrated sensor obeys output = sensitivity·input + offset; sensitivity is the slope, offset is the zero-input bias, and linearity is how well a straight line fits the real curve — an RTD is linear (T = (R − R0)/(R0·α)), a thermocouple is not.",
    "Raw sensor signals are rarely usable directly: signal conditioning amplifies weak signals (thermocouples, strain gauges) so the ADC can see them and filters out noise so the reading can be trusted.",
    "Actuators are chosen by the motion needed: DC motor (continuous spin), stepper (precise open-loop steps), servo (closed-loop positioning under load), and solenoid (binary push/pull).",
    "Steppers position open-loop (no feedback, but can skip steps if overloaded) while servos position closed-loop with built-in sensing and correction — a key distinction when matching an actuator to a task.",
    "Every mechatronic system runs the sense → condition → decide → act loop, repeating continuously so each action changes the world the sensor measures next.",
  ],
};
