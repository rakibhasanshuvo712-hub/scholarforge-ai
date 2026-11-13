import { GenerateApiRequest, GeneratedDocument, SlideItem, ReportSection } from '@/types';

export function generateMockAcademicDocument(req: GenerateApiRequest): GeneratedDocument {
  const { mode, title, description, metadata, codeSnippet, count } = req;
  const now = new Date().toISOString();

  if (mode === 'presentation') {
    const slides: SlideItem[] = [
      {
        id: 'slide-1',
        slideNumber: 1,
        title: title || 'Distributed Consensus in Cloud Computing',
        subtitle: `${metadata.courseCode} - ${metadata.courseTitle}`,
        bullets: [
          `Presented by: ${metadata.studentName} (${metadata.studentId})`,
          `Department of ${metadata.department}, ${metadata.institution}`,
          `Instructor: ${metadata.instructorName}`,
          `Submission Date: ${metadata.submissionDate}`,
        ],
        speakerNotes: 'Introduce yourself, provide the presentation roadmap, and state the primary academic objectives.',
      },
      {
        id: 'slide-2',
        slideNumber: 2,
        title: 'Executive Agenda & Scope',
        subtitle: 'Key Discussion Pillars',
        bullets: [
          'Theoretical Foundations & Problem Statement',
          'System Architecture & Flowchart Walkthrough',
          'Algorithmic Implementation & Core Mechanics',
          'Experimental Benchmark & Performance Metrics',
          'Critical Analysis, Security Implications & Future Scope',
        ],
        speakerNotes: 'Walk the audience through the high-level roadmap and set the stage for the architecture review.',
        callout: 'Core Objective: Provide fault tolerance with guaranteed linearizability under network partitioning.',
      },
      {
        id: 'slide-3',
        slideNumber: 3,
        title: 'System Architecture & Mechanics',
        subtitle: 'Topology & Node State Transition Flow',
        bullets: [
          'Leader-follower quorum model with election timeouts',
          'Heartbeat signals dispatched every 150ms to maintain lease',
          'Log replication happens sequentially with two-phase commit verification',
          'Byzantine fault handling via cryptographic quorum certificates',
        ],
        diagramCode: `flowchart TD
  Client["Client Application"] -->|Propose Transaction| Leader["Leader Node (Raft Consensus)"]
  Leader -->|AppendEntries RPC| F1["Follower Node A"]
  Leader -->|AppendEntries RPC| F2["Follower Node B"]
  Leader -->|AppendEntries RPC| F3["Follower Node C"]
  F1 -->|Quorum ACK| Leader
  F2 -->|Quorum ACK| Leader
  Leader -->|Commit & Apply| StateMachine["Replicated State Machine"]
  StateMachine -->|Success Response| Client`,
        diagramCaption: 'Figure 1: Replicated State Machine and Leader-Follower Consensus Flow',
        speakerNotes: 'Explain how the leader manages log replication across follower nodes and waits for quorum confirmation before committing.',
      },
      {
        id: 'slide-4',
        slideNumber: 4,
        title: 'Algorithmic Implementation',
        subtitle: 'State Transition Logic & Code Walkthrough',
        bullets: [
          'Thread-safe atomic ballot counters prevent split-brain elections',
          'Monotonically increasing term numbers discard stale messages',
          'Graceful node reconnection with log consistency synchronization',
        ],
        codeSnippet: codeSnippet || `// Consensus Heartbeat Dispatcher
async function broadcastHeartbeat(term: number, leaderId: string) {
  const promises = followers.map(peer => 
    peer.sendAppendEntries({
      term,
      leaderId,
      prevLogIndex: peer.matchIndex,
      entries: getUncommittedEntries(peer.matchIndex)
    })
  );
  const responses = await Promise.allSettled(promises);
  return evaluateQuorum(responses);
}`,
        speakerNotes: 'Highlight the atomic guarantees and the asynchronous broadcast loop with non-blocking promises.',
      },
      {
        id: 'slide-5',
        slideNumber: 5,
        title: 'Empirical Results & Benchmark',
        subtitle: 'Throughput vs Latency under Stress',
        bullets: [
          'Average consensus convergence latency: 14.2ms at 99th percentile',
          'System sustains 8,500 operations/sec before queue saturation',
          'Zero data loss observed during simulated 33% node loss test',
          'Rapid failover election accomplished in < 280ms',
        ],
        speakerNotes: 'Emphasize the resilience of the system and explain the trade-offs depicted in the benchmarks.',
        callout: 'Benchmark Insight: Network latency across availability zones is the primary bottleneck for quorum commits.',
      },
      {
        id: 'slide-6',
        slideNumber: 6,
        title: 'Conclusions & Next Steps',
        subtitle: 'Academic Summary',
        bullets: [
          'Consensus protocol successfully met all formal safety and liveness criteria',
          'Verified zero-drift state machine synchronization under heavy concurrency',
          'Future research will explore pipelined batch commits and zero-knowledge verification',
          'Questions & Discussion welcome',
        ],
        speakerNotes: 'Summarize the contribution, invite questions, and provide final remarks.',
      },
    ];

    // Adjust slide count if user specified count
    const finalSlides = count && count >= 3 && count <= 12 ? slides.slice(0, count) : slides;

    return {
      mode: 'presentation',
      title: title || 'Distributed Consensus in Cloud Computing',
      subtitle: `${metadata.courseCode}: ${metadata.courseTitle}`,
      executiveSummary: description || 'A rigorous presentation covering distributed consensus, fault-tolerant state replication, and empirical performance metrics in modern distributed computing.',
      metadata,
      slides: finalSlides,
      primaryDiagram: {
        code: `flowchart TD
  Client["Client Application"] -->|Propose Transaction| Leader["Leader Node (Raft Consensus)"]
  Leader -->|AppendEntries RPC| F1["Follower Node A"]
  Leader -->|AppendEntries RPC| F2["Follower Node B"]
  Leader -->|AppendEntries RPC| F3["Follower Node C"]
  F1 -->|Quorum ACK| Leader
  F2 -->|Quorum ACK| Leader
  Leader -->|Commit & Apply| StateMachine["Replicated State Machine"]
  StateMachine -->|Success Response| Client`,
        title: 'System Consensus Topology',
        type: 'flowchart',
        caption: 'Figure 1: Replicated State Machine and Leader-Follower Consensus Flow',
      },
      references: [
        'Ongaro, D., & Ousterhout, J. (2014). In Search of an Understandable Consensus Algorithm. USENIX ATC.',
        'Lamport, L. (1998). The Part-Time Parliament. ACM Transactions on Computer Systems, 16(2), 133-169.',
        'Dean, J., & Barroso, L. A. (2013). The Tail at Scale. Communications of the ACM, 56(2), 74-80.',
      ],
      generatedAt: now,
    };
  }

  // LAB REPORT or ASSIGNMENT
  const isLab = mode === 'lab_report';

  const sections: ReportSection[] = isLab
    ? [
        {
          id: 'sec-1',
          heading: '1. Objective & Scope of the Experiment',
          subheading: 'Core Investigation Goals',
          content: `The primary objective of this laboratory investigation is to design, implement, and rigorously benchmark ${title || 'a high-performance distributed fault-tolerant system'}. Specifically, the experiment investigates quorum-based state machine replication, resilience against simulated network partitions (split-brain scenarios), and empirical measurements of transaction throughput and consensus latency under increasing concurrency levels.`,
          bulletPoints: [
            'Formulate and execute a fault-tolerant state synchronization protocol.',
            'Measure consensus turnaround latency under simulated round-trip network delays (10ms - 100ms).',
            'Verify linearizability of state transitions across simulated client worker threads.',
            'Validate automated leader failover during unannounced process terminations.',
          ],
        },
        {
          id: 'sec-2',
          heading: '2. Theoretical Background & Literature Review',
          subheading: 'Mathematical & Algorithmic Principles',
          content: `Distributed state consensus is constrained by the CAP Theorem and the FLP Impossibility Result. In an asynchronous network prone to node crashes, deterministic consensus cannot be guaranteed in bounded time unless non-blocking randomness or weak synchrony assumptions (such as partial synchrony timeouts) are introduced. Quorum consensus establishes that any two quorums Q1 and Q2 in a cluster of size 2f + 1 will intersect in at least one non-faulty node, guaranteeing that obsolete state writes are permanently shadowed by newer term increments.`,
          bulletPoints: [
            'Quorum Intersection Property: |Q1 ∩ Q2| >= 1 ensures conflicting state writes cannot both achieve quorum.',
            'Term-based Monotonic Clocking: Replaces physical clock drift with logical lamport clock vectors.',
            'Two-Phase Commit Guarantee: State transitions are staged in log buffers prior to permanent state machine commitment.',
          ],
        },
        {
          id: 'sec-3',
          heading: '3. Apparatus, Environment & Tech Stack',
          subheading: 'Experimental Setup Specifications',
          content: 'The experimental apparatus consisted of a cluster of 5 isolated container instances orchestrated in a simulated network namespace with deterministic packet drop injection using Linux traffic control (tc) and NetEm.',
          tableData: {
            headers: ['Component', 'Specification / Tool', 'Purpose in Investigation'],
            rows: [
              ['Execution Runtime', 'Node.js 20 LTS / TypeScript', 'Asynchronous event loop for high concurrency testing'],
              ['Container Isolation', 'Docker Engine v26.1 / Compose', 'Simulated independent cluster node instances'],
              ['Network Emulator', 'Linux NetEm / tc', 'Artificial latency (20ms) and 5% packet loss simulation'],
              ['Metrics Pipeline', 'Prometheus & Custom Microbench', 'Sub-millisecond histogram collection and logging'],
              ['Operating System', 'Ubuntu 22.04 LTS (Kernel 6.5)', 'Host operating environment'],
            ],
          },
        },
        {
          id: 'sec-4',
          heading: '4. System Architecture & Algorithmic Workflow',
          subheading: 'State Machine & Replication Pipeline',
          content: 'The architectural design is modeled as a replicated log state machine. The diagram below details the end-to-end transaction pipeline from client submission through quorum consensus validation to commit execution.',
          diagramCode: `flowchart TD
  subgraph Client_Space ["Client Space"]
    C1["Client Worker Thread"]
  end

  subgraph Quorum_Cluster ["Consensus Cluster (2f + 1 Nodes)"]
    Leader["Leader Node (Active Lease)"]
    N1["Node 1 (Follower)"]
    N2["Node 2 (Follower)"]
    N3["Node 3 (Follower)"]
  end

  subgraph Storage_Engine ["Persistent Layer"]
    WAL["Write-Ahead Log (Disk)"]
    SM["Replicated State Machine"]
  end

  C1 -->|1. Submit Mutation| Leader
  Leader -->|2. Append to WAL| WAL
  Leader -->|3. AppendEntries RPC| N1
  Leader -->|3. AppendEntries RPC| N2
  Leader -->|3. AppendEntries RPC| N3
  N1 -->|4. ACK Quorum| Leader
  N2 -->|4. ACK Quorum| Leader
  Leader -->|5. Commit State| SM
  SM -->|6. Execution Result| C1`,
          diagramCaption: 'Figure 1: End-to-end Architectural Flowchart of Quorum State Replication',
        },
        {
          id: 'sec-5',
          heading: '5. Algorithmic Implementation',
          subheading: 'Core Code Walkthrough',
          content: 'Below is the core consensus execution engine responsible for validating leader terms, enforcing monotonically increasing log indices, and executing quorum consensus verifications.',
          codeSnippet: codeSnippet || `// Core Quorum Consensus Validation Routine
export class QuorumEngine {
  private currentTerm: number = 0;
  private commitIndex: number = 0;
  private log: Array<{ term: number; data: string }> = [];

  public async replicateEntry(data: string, peers: PeerClient[]): Promise<boolean> {
    const entry = { term: this.currentTerm, data };
    this.log.push(entry);
    const targetIndex = this.log.length - 1;

    let acks = 1; // Self vote
    const requiredQuorum = Math.floor(peers.length / 2) + 1;

    const ackPromises = peers.map(async (peer) => {
      const success = await peer.sendAppendRpc(this.currentTerm, targetIndex, entry);
      if (success) acks++;
    });

    await Promise.allSettled(ackPromises);

    if (acks >= requiredQuorum) {
      this.commitIndex = targetIndex;
      this.applyToStateMachine(this.log[this.commitIndex]);
      return true;
    }
    return false;
  }
}`,
          codeLanguage: 'typescript',
        },
        {
          id: 'sec-6',
          heading: '6. Experimental Results & Data Analysis',
          subheading: 'Quantitative Benchmark & Discussion',
          content: `The benchmark suite subjected the system to 10,000 synthetic operations under 3 distinct network conditions: Standard Local Loopback, Injected 25ms Jitter Delay, and Split-Brain Cluster Partitioning. The table below provides the empirical metrics recorded during the execution cycles.`,
          tableData: {
            headers: ['Test Scenario', 'Throughput (ops/sec)', 'Mean Latency (ms)', 'p99 Latency (ms)', 'Success Rate (%)'],
            rows: [
              ['Baseline (Zero Injected Delay)', '12,450', '2.1 ms', '4.8 ms', '100.0%'],
              ['Injected 25ms Cross-Region Delay', '4,820', '27.4 ms', '36.1 ms', '99.98%'],
              ['Split-Brain Network Partition (2 vs 3)', '2,910', '48.2 ms', '68.5 ms', '100.0% (Isolated Partition safely blocked)'],
              ['High Concurrency Burst (500 threads)', '9,120', '11.8 ms', '21.5 ms', '99.95%'],
            ],
          },
          bulletPoints: [
            'Linearizability verification passed all 10,000 operations without read skew or phantom entries.',
            'The minority partition (2 nodes) accurately rejected write requests, preventing state divergence.',
            'Recovery from node crash took an average of 312ms from SIGKILL to new leader election.',
          ],
        },
        {
          id: 'sec-7',
          heading: '7. Conclusion & Engineering Implications',
          subheading: 'Synthesis of Findings',
          content: `The experimental results conclusively validate the theoretical claims of quorum consensus. By prioritizing consistency and partition tolerance (CP in Brewer's theorem), the system demonstrated rock-solid stability even during simulated node failure and high network jitter. Future enhancements will integrate vectorized log batching and zero-copy ring buffers to improve raw write throughput beyond 25,000 operations per second.`,
        },
      ]
    : [
        {
          id: 'sec-1',
          heading: '1. Problem Statement & Conceptual Overview',
          subheading: 'Academic Foundation',
          content: `This assignment investigates ${title || 'Advanced Computational Modeling and Algorithmic Analysis'}. In this work, we rigorously explore the theoretical architecture, functional constraints, mathematical representations, and practical implementation patterns required to solve modern computational challenges.`,
          bulletPoints: [
            'Deconstruct the core theoretical problem into tractable sub-components.',
            'Design an optimal algorithmic framework with bounded time and space complexity.',
            'Provide mathematical proofs and state-machine verification of correctness.',
          ],
        },
        {
          id: 'sec-2',
          heading: '2. Theoretical Formulation & System Architecture',
          subheading: 'Formal Modeling & Workflow',
          content: 'To model the data flow and operational transformations, we formulate a directed acyclic processing pipeline. The system processes inputs through ingestion, validation, algorithmic transformation, and persistent output dispatching.',
          diagramCode: `flowchart LR
  Input["Raw Data Ingestion"] --> Validator["Schema Validation & Sanitization"]
  Validator --> Transform["Algorithmic Transformation Engine"]
  Transform --> Analyzer["Complexity & Consistency Analyzer"]
  Analyzer --> Output["Formatted Output / Persistence Layer"]`,
          diagramCaption: 'Figure 1: Modular Data Processing and Analytical Architecture',
        },
        {
          id: 'sec-3',
          heading: '3. Detailed Implementation & Analytical Mechanics',
          subheading: 'Algorithmic Walkthrough',
          content: 'The computational routine below demonstrates the optimized algorithmic pipeline designed to address the assignment specifications with minimal computational overhead.',
          codeSnippet: codeSnippet || `// Algorithmic Analysis Routine
export function executeAssignmentAnalysis(dataMatrix: number[][]): { result: number; complexity: string } {
  let optimalMetric = 0;
  // O(N log N) processing with spatial memoization
  for (let i = 0; i < dataMatrix.length; i++) {
    optimalMetric += dataMatrix[i].reduce((acc, curr) => acc ^ curr, 0);
  }
  return {
    result: optimalMetric,
    complexity: "Time: O(N log N) | Space: O(1)"
  };
}`,
          codeLanguage: 'typescript',
        },
        {
          id: 'sec-4',
          heading: '4. Evaluation, Comparative Analysis & Proof of Correctness',
          subheading: 'Analytical Verification',
          content: 'We conduct asymptotic complexity comparisons and verify invariants across test cases. The empirical evaluation proves that the proposed solution scales logarithmically with respect to input size.',
          tableData: {
            headers: ['Algorithm Variant', 'Time Complexity', 'Space Complexity', 'Memory Footprint', 'Robustness Score'],
            rows: [
              ['Naive Recursive Approach', 'O(2^N)', 'O(N) Stack', 'High (Stack Overflow Risk)', '4.2 / 10'],
              ['Memoized Dynamic Programming', 'O(N^2)', 'O(N^2) Cache', 'Moderate', '8.5 / 10'],
              ['ScholarForge Optimized Model (Proposed)', 'O(N log N)', 'O(1) Auxiliary', 'Minimal', '9.8 / 10'],
            ],
          },
        },
        {
          id: 'sec-5',
          heading: '5. Academic Summary & References',
          subheading: 'Final Conclusions',
          content: `In summary, the design and implementation satisfy all assignment criteria. The combination of formal mathematical modeling and defensive programming yields a resilient, high-performance solution ready for production or academic examination.`,
        },
      ];

  const primaryDiagram = {
    code: isLab
      ? `flowchart TD
  Client["Client Request"] --> Leader["Leader Node"]
  Leader -->|Replication Stream| NodeA["Replica A"]
  Leader -->|Replication Stream| NodeB["Replica B"]
  NodeA -->|Quorum ACK| Leader
  NodeB -->|Quorum ACK| Leader
  Leader --> Commit["Commit State to WAL & Disk"]`
      : `flowchart LR
  Input["Raw Ingestion"] --> Process["Core Algorithmic Pipeline"]
  Process --> Verification["Invariant Validation"]
  Verification --> Store["Structured Academic Artifact"]`,
    title: isLab ? 'Quorum Replication Topology' : 'Assignment Computational Workflow',
    type: 'flowchart',
    caption: isLab ? 'Figure 1: High-level System Architecture & Replication Pipeline' : 'Figure 1: Modular Processing Pipeline',
  };

  return {
    mode,
    title: title || (isLab ? 'Investigation of Distributed State Synchronization' : 'Algorithmic Analysis & Architecture'),
    subtitle: `${metadata.courseCode} - ${metadata.courseTitle}`,
    executiveSummary: description || 'A comprehensive, peer-grade academic artifact containing formal theoretical derivations, system architecture diagrams, and verified code implementations.',
    metadata,
    sections,
    primaryDiagram,
    references: [
      'Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2022). Introduction to Algorithms (4th ed.). MIT Press.',
      'Tanenbaum, A. S., & Van Steen, M. (2023). Distributed Systems: Principles and Paradigms (4th ed.).',
      'IEEE Standards Association. (2024). IEEE Standard for System Architecture Descriptions (IEEE Std 42010-2024).',
      'Knuth, D. E. (1997). The Art of Computer Programming: Fundamental Algorithms (Vol. 1). Addison-Wesley.',
    ],
    generatedAt: now,
  };
}
