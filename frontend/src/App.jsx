import { useState } from 'react'

export default function App() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 选择图片
  const onFileChange = (e) => {
    const f = e.target.files?.[0]
    setResult(null)
    setError(null)
    if (!f) {
      setFile(null)
      setPreview(null)
      return
    }
    if (!f.type.startsWith('image/')) {
      setError('请选择图片文件')
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  // 上传并调用后端接口
  const onUpload = async () => {
    if (!file) {
      setError('请先选择一张图片')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const resp = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: form,
      })
      if (!resp.ok) throw new Error('网络错误')
      const data = await resp.json()
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h1>猫狗分类器（前端测试版）</h1>
      <input type="file" accept="image/*" onChange={onFileChange} />

      {preview && (
        <div style={{ marginTop: 20 }}>
          <img
            src={preview}
            alt="预览"
            style={{
              width: 256,
              height: 256,
              objectFit: 'cover',
              borderRadius: 10,
              border: '1px solid #ccc',
            }}
          />
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button
          onClick={onUpload}
          disabled={loading}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {loading ? '预测中…' : '上传并预测'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 20, fontSize: 18 }}>
          预测结果：<b>{result.label}</b>（置信度 {Math.round(result.confidence * 100)}%）
        </div>
      )}
      {error && (
        <div style={{ marginTop: 20, color: 'red' }}>错误：{error}</div>
      )}
    </div>
  )
}
