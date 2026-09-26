'use client'

export function RetryButton() {
  return (
    <button type="button" onClick={() => location.reload()} className="btn btn-gradient">
      আবার চেষ্টা করুন
    </button>
  )
}
