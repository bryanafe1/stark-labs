import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_networking",
  slug: "computer-networking",
  title: "Computer Networking: How a Cat Video Crosses the Planet in 80 Milliseconds",
  summary:
    "You tap a link and a video filmed on the other side of Earth starts playing almost instantly. To pull that off, your request gets wrapped in layer after layer of packaging, sliced into packets, hurled across a dozen unknown machines, and reassembled in order — all in a fraction of a second. This lesson takes you down the stack: the OSI and TCP/IP models, how encapsulation works, why TCP is reliable while UDP is fast-and-reckless, how IP addressing and routing get packets to the right door, and the trio everyone confuses — latency, bandwidth, and throughput — plus why a CDN parked near you can feel like teleportation.",
  discipline: "COMPUTER",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: ["networking", "tcp-ip", "osi"],
  objectives: [
    "Describe the OSI 7-layer model and the TCP/IP model, and explain why we use layered abstractions at all.",
    "Explain encapsulation — how data gets wrapped in headers as it moves down the stack and unwrapped on the way up.",
    "Compare TCP and UDP and choose the right one for a given application.",
    "Explain the basics of IP addressing and how routers forward packets across networks.",
    "Distinguish latency, bandwidth, and throughput, and compute the bandwidth-delay product.",
    "Explain why lower latency and CDNs improve real-world performance, and estimate transfer time from file size and bandwidth.",
  ],
  prerequisites: [
    "A rough idea of what a client and a server are",
    "Comfort with units like megabits (Mb) and megabits per second (Mbps)",
    "Basic arithmetic with division and percentages",
  ],
  interviewAngle:
    "Networking is where systems-design interviews separate people who *use* the internet from people who *understand* it. Interviewers probe whether you can reason about what happens between \"user clicks\" and \"page loads.\" Strong candidates can sketch the layers (and know which layer a problem lives at), explain encapsulation without hand-waving, articulate the TCP-vs-UDP trade-off and *justify* a choice for video calls vs. file downloads, and — crucially — never confuse **latency** (delay) with **bandwidth** (capacity) with **throughput** (actual achieved rate). They know that more bandwidth does not fix high latency, that the bandwidth-delay product tells you how much data is \"in flight,\" and that putting content physically closer to users (a CDN) attacks latency in a way that buying a bigger pipe cannot. Weak candidates think \"the internet is slow\" is a single problem and reach for bandwidth as the universal fix.",
  blocks: [
    {
      id: "net-hook",
      kind: "PROSE",
      title: "The most over-engineered postal service ever built",
      markdown:
        "You click play. A video shot in Tokyo starts streaming to your couch in, say, São Paulo — roughly 18,000 km away — and it begins in well under a second. Pause on how absurd that is. Your request did not float there by magic. It was wrapped in several layers of digital packaging, chopped into hundreds of little **packets**, and flung across a relay race of routers — machines neither you nor the server have ever met — each one glancing at the address and shoving the packet one hop closer. Some packets took different routes. Some arrived out of order. A few got lost and were re-sent. And yet, at your end, they were unwrapped and stitched back into a flawless, in-order stream.\n\nThis is computer networking: an obsessively layered system for moving data between machines that share nothing but a set of agreed-upon **protocols** — the rules of the road. The genius is that no single piece has to understand the whole journey. The app does not care about cables. The cables do not care about video. Each layer does one job and trusts the layer below it to handle the rest.\n\nIn this lesson we will ride a single click all the way down the stack and back up — and by the end, that 80-millisecond cat video will look less like magic and more like brilliant engineering.",
    },
    {
      id: "net-video",
      kind: "VIDEO",
      youtubeId: "6fYsCkvuPbw",
      title: "Watch: OSI & TCP/IP Models in 9 Minutes",
    },
    {
      id: "net-why-layers",
      kind: "PROSE",
      title: "Why we slice the network into layers",
      markdown:
        "Imagine if every app had to know how to encode bits onto a fiber-optic cable, *and* find a route across the planet, *and* recover lost packets, *and* render a webpage — all at once. It would be unmaintainable chaos. So networking is built as a **stack of layers**, where each layer offers a clean service to the one above and relies on the one below, communicating only through well-defined interfaces.\n\nThe payoff of layering is the same as the payoff of any good abstraction:\n\n- **Separation of concerns.** The layer that recovers lost packets does not care whether you are on Wi-Fi or fiber.\n- **Interchangeability.** Swap copper for fiber at the bottom and everything above keeps working untouched.\n- **Independent evolution.** HTTP can get a new version without anyone rewriting how routers forward packets.\n\nThe mental model: each layer talks *logically* to its peer layer on the other machine — your browser \"talks to\" the server's web software, your TCP \"talks to\" its TCP — even though physically, every byte actually travels all the way down your stack, across the wire, and back up theirs. Layers are a polite fiction that makes an impossibly complex system tractable.",
    },
    {
      id: "net-models",
      kind: "PROSE",
      title: "Two maps of the same territory: OSI vs TCP/IP",
      markdown:
        "There are two famous layered models. The **OSI model** is the 7-layer textbook reference; the **TCP/IP model** is the 4-layer description of what the real internet actually runs.\n\nThe **OSI 7 layers**, top to bottom (mnemonic: *All People Seem To Need Data Processing*):\n\n1. **Application** — what the user's program speaks (HTTP, DNS, SMTP).\n2. **Presentation** — formatting, encryption, compression (TLS, character encoding).\n3. **Session** — opening, managing, and closing conversations.\n4. **Transport** — end-to-end delivery between programs (**TCP**, **UDP**); adds ports.\n5. **Network** — routing packets across networks by logical address (**IP**, routers).\n6. **Data Link** — node-to-node delivery on one link, using MAC addresses (Ethernet, switches).\n7. **Physical** — the actual bits on the wire, fiber, or radio.\n\nThe **TCP/IP model** collapses these into four practical layers: **Application** (OSI's top three), **Transport** (TCP/UDP), **Internet** (IP), and **Network Access / Link** (OSI's bottom two). OSI is the vocabulary you reason and debug with; TCP/IP is the architecture the internet was actually built on. Knowing *which layer* a problem lives at is half of debugging it — a DNS failure is layer 7, a routing loop is layer 3, a dead cable is layer 1.",
    },
    {
      id: "net-encapsulation",
      kind: "PROSE",
      title: "Encapsulation: Russian dolls for data",
      markdown:
        "How does data actually move *down* the stack? Through **encapsulation** — each layer wraps the data from the layer above in its own **header** (and sometimes a trailer), like nesting Russian dolls.\n\nFollow one chunk of your data going down the sender's stack:\n\n- The **application** hands down your raw data (say, an HTTP request).\n- The **transport** layer wraps it with a TCP header (adding port numbers, sequence numbers) → now it is a **segment**.\n- The **network** layer wraps *that* with an IP header (adding source and destination IP addresses) → now it is a **packet**.\n- The **link** layer wraps *that* with a frame header/trailer (adding MAC addresses, error check) → now it is a **frame**.\n- The **physical** layer turns the frame into actual signals on the wire.\n\nEach layer treats everything handed to it from above — header and all — as opaque \"payload\" it must not peek inside. On the receiving machine, the process runs in reverse: **de-encapsulation** strips off one header per layer on the way up, until the application gets back exactly the original data. The beautiful part: a router in the middle only needs to read the *IP* header to forward the packet — it never has to understand the application data buried inside. Layering and encapsulation are why the middle of the internet can stay simple while the edges get smart.",
    },
    {
      id: "net-tcp-udp",
      kind: "PROSE",
      title: "TCP vs UDP: the careful courier vs the fire hose",
      markdown:
        "Both TCP and UDP live at the transport layer, but they have opposite personalities.\n\n**TCP (Transmission Control Protocol)** is the careful, anxious courier. Before sending anything it performs a **three-way handshake** (SYN, SYN-ACK, ACK) to establish a connection. Then it guarantees: every byte arrives, **in order**, with no duplicates, and it re-sends anything lost. It also does **flow control** (do not overwhelm a slow receiver) and **congestion control** (back off when the network is jammed). All those guarantees cost overhead and add delay. Use TCP when correctness matters more than speed: web pages, file downloads, email, anything where a single missing byte ruins everything.\n\n**UDP (User Datagram Protocol)** is the fire hose. No handshake, no connection, no guarantees — it just sprays packets (\"datagrams\") and forgets them. Packets may arrive out of order, duplicated, or not at all, and UDP will not lift a finger to fix it. In exchange, it is *fast* and *lightweight*, with almost no overhead. Use UDP when timeliness beats perfection: live video calls, gaming, voice — where a dropped frame from a moment ago is worthless, so re-sending it is pointless. Better to skip it and stay current.\n\nThe one-line trade-off: **TCP trades speed for reliability; UDP trades reliability for speed.** The art is matching the protocol to what the application actually needs.",
    },
    {
      id: "net-ip-routing",
      kind: "PROSE",
      title: "IP addressing and routing: getting to the right door",
      markdown:
        "For a packet to reach a destination, that destination needs an address. That is the job of the **IP address** — a logical, network-assigned identifier (IPv4 looks like `192.168.1.10`; IPv6 is far longer to provide vastly more addresses). An IP address has two conceptual parts: a **network** portion (which network you are on) and a **host** portion (which machine on that network), split by a **subnet mask**.\n\nGetting a packet from one network to another is **routing**, the job of **routers**. No single router knows the whole path. Instead, each router holds a **routing table** and makes a *local* decision: \"based on the destination IP, which neighbor should I forward this to as the next hop?\" The packet bounces from router to router — each hop getting it closer — until it lands on the destination network, where the **link layer** delivers it to the exact machine using its **MAC address** (a hardware identifier). A nice way to see this distinction: the IP address is *where you are going* (it can change as you move networks), while the MAC address is *who you are* on the local wire.\n\nThis hop-by-hop, decentralized design is why the internet is so robust: if one router or link dies, packets simply route around it. There is no central map — just millions of routers each making good local choices, and a few protocols (like BGP) helping them share what they know.",
    },
    {
      id: "net-latency-bandwidth",
      kind: "PROSE",
      title: "Latency vs bandwidth vs throughput (stop confusing these)",
      markdown:
        "These three words get mashed together constantly, and untangling them is one of the highest-value things you can learn here. Use the highway analogy:\n\n- **Latency** is *delay* — how long one car takes to drive from A to B. In networking, it is the time for one bit to travel across (often measured as round-trip time, **RTT**, or \"ping\"). Bounded by distance and the speed of light, plus processing at each hop. **Lower is better.**\n- **Bandwidth** is *capacity* — how many lanes the highway has, i.e., the maximum data rate the link *could* carry (measured in bits per second). **Higher is better.**\n- **Throughput** is *what you actually get* — how many cars per minute really make it through, given traffic, accidents, and tolls. Throughput is the real-world achieved rate, always ≤ bandwidth.\n\nThe crucial, counterintuitive truth: **more bandwidth does not reduce latency.** Adding lanes to a highway does not make any single car arrive sooner; it just lets more cars travel at once. So a fat 1 Gbps link from New York to Sydney still has high latency because the signal must physically cross the Pacific — light takes time. If your app feels laggy because of *delay* (a slow first response, a stuttering game), buying more bandwidth will not help; you need to attack latency. If it feels slow because of *capacity* (a huge file downloading forever), more bandwidth is exactly the fix. Diagnosing *which* problem you have is the whole game.",
    },
    {
      id: "net-formula",
      kind: "FORMULA",
      title: "Transmission time and the bandwidth-delay product",
      display: "Transmission time = size / bandwidth   •   BDP = bandwidth × RTT",
      variables: [
        { symbol: "size", name: "Amount of data to send", unit: "bits (or Mb)" },
        { symbol: "bandwidth", name: "Link capacity / data rate", unit: "bits/s (or Mbps)" },
        { symbol: "RTT", name: "Round-trip time (latency there and back)", unit: "s" },
        { symbol: "BDP", name: "Bandwidth-delay product — data \"in flight\" on the wire", unit: "bits" },
      ],
      note:
        "Two distinct quantities. **Transmission time = size / bandwidth** is how long it takes to push the bits out the door — pure capacity. But the *total* time to receive something also includes **propagation delay** (latency): a small request over a long link is dominated by RTT, not transmission time. The **bandwidth-delay product** (bandwidth × RTT) tells you how many bits can be \"in flight\" at once — essentially the capacity of the pipe itself. It is why high-bandwidth, high-latency links (\"long fat networks\") need large TCP windows: if you only send a little before waiting for an ACK, you leave most of the pipe empty.",
    },
    {
      id: "net-sandbox",
      kind: "SANDBOX",
      title: "Play: how long to push the bits out?",
      description:
        "This computes pure transmission time = file size / bandwidth. With the defaults (100 Mb file over a 50 Mbps link) you get 2.00 s — that is the time just to *send* the bits, before adding any latency. Now try the two extremes: crank bandwidth up to 1000 Mbps and watch the time shrink toward instant, then drop bandwidth to 1 Mbps and watch a modest file crawl. Remember: this is transmission time only — the *total* time also includes round-trip latency, which a fatter pipe never reduces.",
      variables: [
        { key: "size", label: "File size", unit: "Mb", min: 1, max: 1000, step: 1, default: 100 },
        { key: "bw", label: "Bandwidth", unit: "Mbps", min: 1, max: 1000, step: 1, default: 50 },
      ],
      expression: "size / bw",
      outputLabel: "Transmission time",
      outputUnit: "s",
      precision: 2,
    },
    {
      id: "net-predict-bandwidth",
      kind: "PREDICT",
      question:
        "Your video calls are choppy and laggy. Your connection is already a blazing 1 Gbps, but the call server is on the opposite side of the planet. You upgrade to 2 Gbps. What happens to the lag? Lock in your guess.",
      options: [
        { id: "a", label: "The lag is cut roughly in half — double the bandwidth, half the delay." },
        { id: "b", label: "The lag is basically unchanged — bandwidth does not fix latency caused by distance." },
        { id: "c", label: "The lag disappears entirely." },
        { id: "d", label: "The lag gets worse because more bandwidth means more congestion." },
      ],
      answerId: "b",
      reveal:
        "**Basically unchanged.** Lag in a video call is a *latency* problem, and latency is governed by distance and the speed of light, not by how many lanes your highway has. You already had 1 Gbps — plenty of capacity — so the bits were never the bottleneck; the *delay* of crossing the planet was. Doubling bandwidth lets *more* data flow at once, but it does not make any single packet arrive sooner. The real fixes for this are putting the server physically closer (a regional server or CDN edge) or using a protocol like UDP that does not re-send stale frames. This latency-vs-bandwidth confusion is one of the most common (and most tested) mistakes in networking.",
    },
    {
      id: "net-predict-protocol",
      kind: "PREDICT",
      question:
        "You are designing a live multiplayer game. Player positions update 60 times per second. If a single position update is lost in transit, which behavior do you want?",
      options: [
        { id: "a", label: "Stop and re-send the lost update reliably before sending newer ones (use TCP)." },
        { id: "b", label: "Forget the lost update and keep sending the latest positions (use UDP)." },
        { id: "c", label: "It does not matter; both protocols behave identically here." },
        { id: "d", label: "Send every update twice over TCP to be safe." },
      ],
      answerId: "b",
      reveal:
        "**Forget it and keep going — use UDP.** A position from 1/60th of a second ago is already stale and worthless; by the time TCP detected the loss and re-sent it, two or three *newer* positions would exist. Worse, TCP's in-order guarantee means it would *hold back* those newer updates until the old one arrived — a phenomenon called head-of-line blocking — making the game lag exactly when you can least afford it. UDP's \"fire and forget\" is the right tool: drop the stale packet, stay current. This is the canonical reason real-time games, voice, and live video lean on UDP while file transfers and web pages lean on TCP.",
    },
    {
      id: "net-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: how long does a transfer REALLY take?",
      problem:
        "You are downloading a 200 Mb file from a server. Your link bandwidth is 50 Mbps, and the round-trip latency (RTT) between you and the server is 100 ms (0.1 s). Estimate (1) the pure transmission time, and (2) a rough total time that also accounts for the connection setup. Then explain why a CDN placed near you would help.",
      steps: [
        {
          label: "(1) Transmission time = size / bandwidth",
          markdown:
            "Plug into the formula: 200 Mb / 50 Mbps = **4.0 s**. This is the time just to push the file's bits through the pipe at full capacity — capacity-bound, latency not yet included.",
        },
        {
          label: "(2) Add the latency overhead",
          markdown:
            "Before data flows, TCP's three-way handshake costs about one RTT (~0.1 s), and the first byte cannot arrive sooner than ~half an RTT of propagation. So you add a small fixed latency overhead — on the order of one to two RTTs (~0.1–0.2 s) — on top of the 4.0 s. Rough total: **~4.1–4.2 s.**",
        },
        {
          label: "Which term dominates here?",
          markdown:
            "For this *large* file, transmission time (4.0 s) dwarfs the latency overhead (~0.1 s) — so this transfer is **bandwidth-bound**, and a faster link would genuinely help. But flip the scenario: for a *tiny* 1 Mb request (0.02 s to transmit), that same 0.1 s of RTT would dominate, making the transfer **latency-bound** — and more bandwidth would barely move it.",
        },
        {
          label: "Why a CDN near you helps",
          markdown:
            "A **CDN (Content Delivery Network)** caches the file on an edge server physically close to you. That slashes the RTT — say from 100 ms to 10 ms. For small requests and connection setup, that is a direct, dramatic win (less handshake delay, faster first byte). It also tends to improve sustained throughput, because TCP ramps up faster and congestion-control penalties shrink on short, low-latency paths. The CDN attacks *latency* — the thing buying more bandwidth could never fix.",
        },
      ],
      answer:
        "Transmission time ≈ 4.0 s; total ≈ 4.1–4.2 s once you add ~1 RTT of setup. The big file is bandwidth-bound, but a CDN that cuts RTT from 100 ms to ~10 ms speeds up setup, first-byte time, and throughput ramp — because it targets latency, which extra bandwidth cannot.",
    },
    {
      id: "net-check-layer",
      kind: "CHECK",
      question:
        "A packet leaves your computer. At which layer is the destination IP address added, and which device primarily uses it to decide where to forward the packet next?",
      choices: [
        { id: "a", label: "The Network (Internet) layer adds the IP address, and routers use it to forward packets hop by hop." },
        { id: "b", label: "The Transport layer adds the IP address, and switches use it." },
        { id: "c", label: "The Application layer adds the IP address, and the browser uses it." },
        { id: "d", label: "The Physical layer adds the IP address, and the cable uses it." },
      ],
      answerId: "a",
      explanation:
        "The **Network layer** (the Internet layer in TCP/IP) is responsible for logical addressing, so it stamps on the source and destination **IP addresses** during encapsulation, turning a segment into a **packet**. **Routers** operate at this layer: each one reads the destination IP and consults its routing table to pick the next hop. Do not confuse this with the **Transport layer** (which adds *ports*, not IPs, via TCP/UDP) or the **Data Link layer** (which adds *MAC addresses* and is where *switches* operate for local delivery). Knowing which layer owns which job is exactly how you localize a network bug.",
    },
    {
      id: "net-check-throughput",
      kind: "CHECK",
      question:
        "Your ISP sells you \"100 Mbps,\" but a download tops out at 60 Mbps. The 100 Mbps figure and the 60 Mbps figure are best described as which two concepts?",
      choices: [
        { id: "a", label: "100 Mbps is the bandwidth (max capacity); 60 Mbps is the throughput (actual achieved rate, always ≤ bandwidth)." },
        { id: "b", label: "100 Mbps is the latency; 60 Mbps is the bandwidth." },
        { id: "c", label: "Both are throughput; the ISP simply lied." },
        { id: "d", label: "100 Mbps is throughput; 60 Mbps is bandwidth." },
      ],
      answerId: "a",
      explanation:
        "**Bandwidth** is the *maximum* capacity of the link — the advertised 100 Mbps, the number of lanes on the highway. **Throughput** is what you *actually* achieve in practice — 60 Mbps here — and it is always less than or equal to bandwidth because of real-world friction: congestion, protocol overhead, a slow server, packet loss triggering TCP backoff, or Wi-Fi interference. Neither number is **latency**, which measures *delay*, not rate. The gap between advertised bandwidth and observed throughput is completely normal; the useful skill is asking *why* throughput fell short, since the cause (congestion vs. a slow server vs. loss) points to different fixes.",
    },
    {
      id: "net-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What interviewers actually want from the networking round",
      markdown:
        "Have crisp, confident answers to these:\n\n1. **\"TCP or UDP, and why?\"** Never just name one — justify it with the application's needs. Reliable + ordered (web, files, email) → TCP. Timely + lightweight, loss-tolerant (video calls, games, voice) → UDP. Mention TCP's handshake and head-of-line blocking as the reasons real-time apps avoid it.\n2. **\"Latency vs bandwidth vs throughput.\"** Define all three crisply and *say the kicker*: more bandwidth does not reduce latency. This single distinction is tested constantly.\n3. **\"Walk me through what happens when I type a URL and hit enter.\"** The all-time classic. Hit the high points: DNS lookup → TCP handshake (+ TLS) → HTTP request → routing across the internet → response → render. Name the layers as you go.\n4. **\"What does a CDN do and why does it help?\"** It caches content at edge locations near users, cutting RTT — attacking latency, which bandwidth cannot fix.\n5. **\"Explain encapsulation.\"** Each layer wraps the layer above in a header; routers read only the IP header; the receiver de-encapsulates back up the stack.\n\nThe meta-signal: can you reason about *which layer* and *which metric* a problem belongs to, instead of treating \"the network is slow\" as one undifferentiated blob?",
    },
    {
      id: "net-callout-warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Networking traps that cost points",
      markdown:
        "- **Bandwidth ≠ latency.** The number one mistake. More capacity never makes a single packet arrive sooner; only shorter distance / fewer hops do that.\n- **Throughput ≤ bandwidth, always.** Advertised speed is a ceiling, not a promise. Congestion, overhead, and loss pull the real rate below it.\n- **TCP is not \"better\" than UDP.** They are different tools. TCP's reliability is a *liability* for real-time apps because re-sending stale data and in-order delivery cause lag.\n- **IP address vs MAC address.** IP is the logical, routable, changeable address used by routers (layer 3); MAC is the fixed hardware address used for local delivery (layer 2). Routers route on IP, switches switch on MAC.\n- **Layers are logical, bytes are physical.** Each layer *logically* talks to its peer, but every byte physically travels all the way down and back up the stack. Do not imagine data \"jumping\" between same-named layers across the wire.\n- **More bandwidth will not fix a tiny-request app.** If your workload is many small requests, you are latency-bound; the fix is fewer round trips or a closer server, not a bigger pipe.",
    },
    {
      id: "net-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "The frame that makes networking click",
      markdown:
        "Networking is just **layered abstraction applied to moving data between strangers.** Each layer solves exactly one problem and trusts the rest: the **link** layer moves bits across one hop, the **network** layer (IP + routers) gets packets across the whole planet hop by hop, the **transport** layer (TCP/UDP) decides whether to be careful or fast, and the **application** layer speaks human-meaningful protocols. **Encapsulation** is how a request rides down that stack — wrapped in a header per layer — and de-encapsulation unwraps it on the far side. And when performance matters, always ask the diagnostic question: is this a **latency** problem (delay — fix with proximity, CDNs, fewer round trips) or a **bandwidth** problem (capacity — fix with a bigger pipe)? Get the layer right and the metric right, and almost every networking question becomes answerable.",
    },
  ],
  keyTakeaways: [
    "Networking is built as layers so each one solves a single problem and trusts the others; the OSI model gives 7 layers for reasoning, while the TCP/IP model describes the 4 layers the internet actually runs.",
    "Encapsulation wraps data in a header at each layer going down (segment → packet → frame) and de-encapsulation unwraps it going up, so a router only needs to read the IP header to forward a packet.",
    "TCP is reliable and ordered (handshake, retransmission, flow/congestion control) for web and files; UDP is fast and connectionless with no guarantees, ideal for real-time video, voice, and games.",
    "IP addresses are logical, routable identifiers; routers forward packets hop by hop using local routing-table decisions, while MAC addresses handle final delivery on the local link — a decentralized design that routes around failures.",
    "Latency is delay, bandwidth is maximum capacity, and throughput is the actual achieved rate (always ≤ bandwidth) — and crucially, adding bandwidth does not reduce latency.",
    "Transmission time = size / bandwidth, but total transfer time also includes round-trip latency; the bandwidth-delay product (bandwidth × RTT) measures how much data can be in flight at once.",
    "CDNs and lower latency speed up real-world performance by shortening RTT — attacking the delay problem that buying more bandwidth can never solve.",
  ],
};
