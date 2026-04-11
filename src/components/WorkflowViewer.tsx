import {
  addEdge,
  Background,
  BackgroundVariant,
  type Connection,
  Controls,
  type Edge,
  Handle,
  MiniMap,
  type Node,
  type NodeProps,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import "@xyflow/react/dist/style.css";

// ── Color map for n8n node types ──────────────────────────────────────────────
function getNodeColor(type: string | undefined): string {
  if (!type) return "#64748b";
  const t = type.toLowerCase();
  if (t.includes("stickynote")) return "#f5e642";
  if (
    t.includes("trigger") ||
    t.includes("webhook") ||
    t.includes("schedule") ||
    t.includes("cron")
  )
    return "#10b981";
  if (
    t.includes("gmail") ||
    t.includes("email") ||
    t.includes("smtp") ||
    t.includes("outlook") ||
    t.includes("imap")
  )
    return "#ea4335";
  if (t.includes("googlesheet") || t.includes("spreadsheet")) return "#34a853";
  if (t.includes("googledrive") || t.includes("google-drive")) return "#4285f4";
  if (t.includes("http") || t.includes("request")) return "#3b82f6";
  if (
    t.includes("if") ||
    t.includes("switch") ||
    t.includes("condition") ||
    t.includes("merge")
  )
    return "#f59e0b";
  if (
    t.includes("function") ||
    t.includes("code") ||
    t.includes("javascript") ||
    t.includes("python")
  )
    return "#8b5cf6";
  if (
    t.includes("telegram") ||
    t.includes("slack") ||
    t.includes("discord") ||
    t.includes("whatsapp")
  )
    return "#06b6d4";
  if (
    t.includes("openai") ||
    t.includes("gemini") ||
    t.includes("anthropic") ||
    t.includes("llm") ||
    t.includes("langchain")
  )
    return "#7c3aed";
  if (
    t.includes("postgres") ||
    t.includes("mysql") ||
    t.includes("mongo") ||
    t.includes("redis")
  )
    return "#0ea5e9";
  if (t.includes("set") || t.includes("noop")) return "#64748b";
  return "#ff6d5a";
}

// ── Types ────────────────────────────────────────────────────────────────────
interface N8nRawNode {
  name: string;
  type?: string;
  position?: [number, number];
  parameters?: Record<string, unknown>;
}

interface N8nConnectionTarget {
  node: string;
  type?: string;
  index?: number;
}

interface N8nWorkflow {
  nodes?: N8nRawNode[];
  connections?: Record<string, { main?: N8nConnectionTarget[][] }>;
}

interface N8nNodeData {
  label: string;
  nodeType: string;
  color: string;
  parameters?: Record<string, unknown>;
  [key: string]: unknown;
}

// ── Parse n8n JSON → React Flow nodes/edges ──────────────────────────────────
function parseN8nWorkflow(raw: string): { nodes: Node[]; edges: Edge[] } {
  let wf: N8nWorkflow;
  try {
    wf = JSON.parse(raw) as N8nWorkflow;
  } catch {
    return { nodes: [], edges: [] };
  }

  const rawNodes = wf.nodes ?? [];
  const connections = wf.connections ?? {};

  const nodes: Node[] = rawNodes.map((n) => {
    const isStickyNote = (n.type ?? "").toLowerCase().includes("stickynote");
    const w = isStickyNote ? Number(n.parameters?.width ?? 240) : 200;
    const h = isStickyNote ? Number(n.parameters?.height ?? 120) : 60;

    return {
      id: n.name,
      type: isStickyNote ? "stickyNote" : "n8nNode",
      position: { x: n.position?.[0] ?? 0, y: n.position?.[1] ?? 0 },
      data: {
        label: n.name,
        nodeType: n.type ?? "",
        color: getNodeColor(n.type),
        parameters: n.parameters,
      } satisfies N8nNodeData,
      style: { width: w, height: h },
    };
  });

  const edges: Edge[] = [];
  let edgeIdx = 0;

  Object.entries(connections).forEach(([fromName, conns]) => {
    const outputs = conns.main ?? [];
    outputs.forEach((outputArr, outputIdx) => {
      (outputArr ?? []).forEach((conn) => {
        edges.push({
          id: `e${edgeIdx++}`,
          source: fromName,
          target: conn.node,
          sourceHandle: `output-${outputIdx}`,
          type: "smoothstep",
          style: { stroke: "#ff6d5a", strokeWidth: 2, opacity: 0.7 },
          animated: false,
        });
      });
    });
  });

  return { nodes, edges };
}

// ── Custom n8n node component ─────────────────────────────────────────────────
function N8nNodeComponent({ data }: NodeProps) {
  const d = data as N8nNodeData;
  return (
    <div
      style={{
        background: d.color,
        borderRadius: 8,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.15)",
        cursor: "pointer",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "rgba(255,255,255,0.5)",
          border: "none",
          width: 8,
          height: 8,
        }}
      />
      <span
        style={{
          color: "#fff",
          fontWeight: 600,
          fontSize: 12,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        }}
      >
        {d.label}
      </span>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "rgba(255,255,255,0.5)",
          border: "none",
          width: 8,
          height: 8,
        }}
      />
    </div>
  );
}

// ── Sticky note node ──────────────────────────────────────────────────────────
function StickyNoteComponent({ data }: NodeProps) {
  const d = data as N8nNodeData;
  const color = String(d.parameters?.color ?? "#f5e642");
  const content = String(d.parameters?.content ?? d.label ?? "");
  return (
    <div
      style={{
        background: color,
        borderRadius: 4,
        width: "100%",
        height: "100%",
        padding: 10,
        fontSize: 11,
        color: "#333",
        overflow: "hidden",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        boxShadow: "2px 2px 6px rgba(0,0,0,.2)",
      }}
    >
      {content}
    </div>
  );
}

const nodeTypes = {
  n8nNode: N8nNodeComponent,
  stickyNote: StickyNoteComponent,
};

// ── Detail panel for double-clicked node ─────────────────────────────────────
interface DetailPanelProps {
  node: Node | null;
  onClose: () => void;
}

function DetailPanel({ node, onClose }: DetailPanelProps) {
  if (!node) return null;
  const d = node.data as N8nNodeData;

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 20,
        background: "#1e1e2e",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 10,
        padding: "14px 16px",
        maxWidth: 320,
        maxHeight: "80%",
        overflowY: "auto",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        fontSize: 12,
        color: "#e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 13 }}>{d.label}</span>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: 16,
            lineHeight: 1,
            padding: 2,
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ marginBottom: 6, color: "#94a3b8", fontSize: 11 }}>
        {d.nodeType}
      </div>
      {d.parameters && Object.keys(d.parameters).length > 0 && (
        <>
          <div style={{ fontWeight: 600, marginBottom: 4, color: "#94a3b8" }}>
            Parameters
          </div>
          <pre
            style={{
              background: "rgba(0,0,0,0.3)",
              borderRadius: 6,
              padding: "8px 10px",
              fontSize: 10,
              color: "#a5f3fc",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              maxHeight: 300,
              overflowY: "auto",
              margin: 0,
            }}
          >
            {JSON.stringify(d.parameters, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface WorkflowViewerProps {
  snippet: string;
}

export default function WorkflowViewer({ snippet }: WorkflowViewerProps) {
  const { nodes: initialNodes, edges: initialEdges } =
    parseN8nWorkflow(snippet);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  if (!initialNodes.length) {
    return (
      <div style={{ padding: 16, color: "#94a3b8", fontSize: 13 }}>
        Workflow tidak dapat di-render. JSON tidak valid atau kosong.
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        style={{ background: "#0f172a" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(255,255,255,0.06)"
        />
        <Controls
          style={{
            background: "#1e293b",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
        <MiniMap
          style={{
            background: "#1e293b",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          nodeColor={(n) => {
            const d = n.data as N8nNodeData;
            return d?.color ?? "#64748b";
          }}
        />
      </ReactFlow>

      <DetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}
