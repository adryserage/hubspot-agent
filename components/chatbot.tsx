"use client"

import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/chat-container"
import { DotsLoader } from "@/components/loader"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/message"
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import {
  AlertTriangle,
  ArrowUp,
  Copy,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import { memo, useState } from "react"
import { Tool } from "./ui/tool"
import { PromptSuggestion } from "./ui/prompt-suggestion"
import { ScrollButton } from "./ui/scroll-button"

type MessageComponentProps = {
  message: UIMessage
  isLastMessage: boolean
}

export const MessageComponent = memo(
  ({ message, isLastMessage }: MessageComponentProps) => {
    const isAssistant = message.role === "assistant"

    return (
      <Message
        className={cn(
          "mx-auto flex w-full max-w-5xl flex-col gap-2 px-2 md:px-10",
          isAssistant ? "items-start" : "items-end"
        )}
      >
        {isAssistant ? (
          <div className="group flex w-full flex-col gap-0">
            {message.parts
              .map((part, i) => (part.type === "text" ? (
                <MessageContent
                  key={i}
                  className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0 "
                  markdown
                >
                  {part.text}
                </MessageContent>

              ) : part.type === "dynamic-tool" ? (
                <Tool
                  key={i}
                  className="w-full max-w-md"
                  toolPart={{
                    type: part.toolName,
                    state: part.state,
                    // @ts-ignore
                    input: part.input,
                    // @ts-ignore
                    output: part.output,
                    toolCallId: part.toolCallId,
                    errorText: part.errorText,
                  }}
                />
              ) : <div key={i}></div>))}
            {/* <MessageActions
              className={cn(
                "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                isLastMessage && "opacity-100"
              )}
            >
              <MessageAction tooltip="Copy" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Copy />
                </Button>
              </MessageAction>
              <MessageAction tooltip="Upvote" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ThumbsUp />
                </Button>
              </MessageAction>
              <MessageAction tooltip="Downvote" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ThumbsDown />
                </Button>
              </MessageAction>
            </MessageActions> */}
          </div>
        ) : (
          <div className="group flex w-full flex-col items-end gap-1">
            <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 whitespace-pre-wrap sm:max-w-[75%]">
              {message.parts
                .map((part) => (part.type === "text" ? part.text : null))
                .join("")}
            </MessageContent>
            <MessageActions
              className={cn(
                "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              )}
            >
              <MessageAction tooltip="Copy" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Copy />
                </Button>
              </MessageAction>
            </MessageActions>
          </div>
        )}
      </Message>
    )
  }
)

MessageComponent.displayName = "MessageComponent"

const LoadingMessage = memo(() => (
  <Message className="mx-auto flex w-full max-w-5xl flex-col items-start gap-2 px-0 md:px-10">
    <div className="group flex w-full flex-col gap-0">
      <div className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0">
        <DotsLoader />
      </div>
    </div>
  </Message>
))

LoadingMessage.displayName = "LoadingMessage"

const ErrorMessage = memo(({ error }: { error: Error }) => (
  <Message className="not-prose mx-auto flex w-full max-w-5xl flex-col items-start gap-2 px-0 md:px-10">
    <div className="group flex w-full flex-col items-start gap-0">
      <div className="text-primary flex min-w-0 flex-1 flex-row items-center gap-2 rounded-lg border-2 border-red-300 bg-red-300/20 px-2 py-1">
        <AlertTriangle size={16} className="text-red-500" />
        <p className="text-red-500">{error.message}</p>
      </div>
    </div>
  </Message>
))

ErrorMessage.displayName = "ErrorMessage"

function ConversationPromptInput() {
  const [input, setInput] = useState("")

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/primitives/chatbot",
    }),
  })

  const handleSubmit = () => {
    if (!input.trim()) return

    sendMessage({ text: input })
    setInput("")
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <ChatContainerRoot className="relative flex-1 space-y-0 overflow-y-auto">

        <ChatContainerContent className="space-y-12 px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-row gap-2 items-end">
              <img src={"/hubspot.png"} className="w-5 h-5" alt="hubspot" />
              <h1 className=" text-xl pt-4 font-medium">HubSpot Agent</h1>
            </div>
            <p>Enhance your customer relationship management with HubSpot AI Agent. Automate lead management, improve customer engagement, and streamline data handling.</p>
          </div>
          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1

            return (
              <MessageComponent
                key={message.id}
                message={message}
                isLastMessage={isLastMessage}
              />
            )
          })}

          {status === "submitted" && <LoadingMessage />}
          {status === "error" && error && <ErrorMessage error={error} />}
        </ChatContainerContent>
        <div className="absolute right-12 bottom-4">
          <ScrollButton />
        </div>
      </ChatContainerRoot>
      <div className="inset-x-0 bottom-0 mx-auto w-full max-w-5xl shrink-0 px-3 pb-3 md:px-5 md:pb-5 flex flex-wrap gap-2">
        <PromptSuggestion onClick={() => setInput("Show me the latest 10 deals that have closed inside of my HubSpot CRM")}>
          Get recent 10 deals
        </PromptSuggestion>
        <PromptSuggestion onClick={() => setInput("Show me the full details and insights of the most recent deal in my HubSpot CRM")}>
          Get detail of most recent deal
        </PromptSuggestion>
        <PromptSuggestion onClick={() => setInput("Show me 10 contacts from my HubSpot CRM")}>
          Get 10 contacts
        </PromptSuggestion>
        <PromptInput
          isLoading={status !== "ready"}
          value={input}
          onValueChange={setInput}
          onSubmit={handleSubmit}
          className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
        >
          <div className="flex flex-col">
            <PromptInputTextarea
              placeholder="Ask anything"
              className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
            />

            <PromptInputActions className="mt-3 flex w-full items-center justify-between gap-2 p-2">
              <div />
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  disabled={
                    !input.trim() || (status !== "ready" && status !== "error")
                  }
                  onClick={handleSubmit}
                  className="size-9 rounded-full"
                >
                  {status === "ready" || status === "error" ? (
                    <ArrowUp size={18} />
                  ) : (
                    <span className="size-3 rounded-xs bg-white" />
                  )}
                </Button>
              </div>
            </PromptInputActions>
          </div>
        </PromptInput>
      </div>
    </div>
  )
}

export default ConversationPromptInput
