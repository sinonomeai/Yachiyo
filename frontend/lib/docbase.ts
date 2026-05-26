export async function fetchDocBases() {
  const res = await fetch("/api/initialData/getDocBases");
  return res.json();
}

export async function fetchDocuments(knowledgeBaseId: string) {
  const res = await fetch(`/api/initialData/getDocuments?knowledgeBaseId=${knowledgeBaseId}`);
  return res.json();
}

export async function fetchChunks(documentId: string) {
  const res = await fetch(`/api/initialData/getChunks?documentId=${documentId}`);
  return res.json();
}

export async function uploadDocument(
  baseId: string,
  data: {
    filename: string;
    file_type: string;
    file_size: number;
    raw_content: string;
  },
) {
  const res = await fetch(`/api/knowledge-bases/${baseId}/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "上传失败");
  }
  return json;
}

export async function deleteDocument(baseId: string, documentId: string) {
  const res = await fetch(
    `/api/knowledge-bases/${baseId}/documents?documentId=${documentId}`,
    { method: "DELETE" },
  );
  return res.json();
}

export async function renameDocument(
  baseId: string,
  documentId: string,
  filename: string,
) {
  const res = await fetch(`/api/knowledge-bases/${baseId}/documents`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentId, filename }),
  });
  return res.json();
}
