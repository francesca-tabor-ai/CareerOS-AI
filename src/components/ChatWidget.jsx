import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAIResponse } from '../lib/chatKnowledge'

const PROMPT_PROBES = [
  'What does CareerOS do?',
  'How much does it cost?',
  'Who is CareerOS for?',
  'What are the main features?',
  'How do I get started?',
  'How do I contact support?',
  'Tell me about case studies',
]

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const navigate = useNavigate()

  const sendMessage = (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed) return

    const userMsg = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay for a more natural feel
    setTimeout(() => {
      let reply = getAIResponse(trimmed)
      // Parse **bold** to <strong>
      reply = reply.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Parse [text](/path) into clickable navigation links
      reply = reply.replace(
        /\[([^\]]+)\]\(\/([^)]+)\)/g,
        (_, label, path) => `<a href="#" class="chat-link" data-path="/${path}">${label}</a>`
      )
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      setIsTyping(false)
    }, 400 + Math.random() * 300)
  }

  const handleProbeClick = (probe) => {
    sendMessage(probe)
  }

  const handleChatClick = (e) => {
    const link = e.target.closest('.chat-link')
    if (link) {
      e.preventDefault()
      const path = link.getAttribute('data-path')
      if (path) {
        navigate(path)
        setIsOpen(false)
      }
    }
  }

  return (
    <>
      {/* Floating chat button */}
      <button
        type="button"
        className="chat-toggle"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-avatar">AI</span>
              <div>
                <strong>CareerOS Guide</strong>
                <span className="chat-status">Online · Ready to help</span>
              </div>
            </div>
          </div>

          <div className="chat-body" onClick={handleChatClick}>
            {messages.length === 0 ? (
              <div className="chat-welcome">
                <p>Hi! I&apos;m your CareerOS AI assistant. Ask me anything about the platform — I can explain features, pricing, and guide you to the right resources.</p>
                <p className="chat-probes-label">Try one of these:</p>
                <div className="chat-probes">
                  {PROMPT_PROBES.map((probe) => (
                    <button
                      key={probe}
                      type="button"
                      className="chat-probe"
                      onClick={() => handleProbeClick(probe)}
                    >
                      {probe}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <div key={i} className={`chat-message chat-message-${m.role}`}>
                    {m.role === 'assistant' && <span className="chat-avatar-sm">AI</span>}
                    <div
                      className="chat-bubble"
                      dangerouslySetInnerHTML={{ __html: m.content }}
                    />
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-message chat-message-assistant">
                    <span className="chat-avatar-sm">AI</span>
                    <div className="chat-typing">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                <div className="chat-probes-inline">
                  {PROMPT_PROBES.filter((p) => !messages.some((m) => m.role === 'user' && m.content === p)).slice(0, 3).map((probe) => (
                    <button key={probe} type="button" className="chat-probe-sm" onClick={() => handleProbeClick(probe)}>
                      {probe}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about CareerOS..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              autoFocus
            />
            <button type="button" className="chat-send" onClick={() => sendMessage()} aria-label="Send">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatWidget
