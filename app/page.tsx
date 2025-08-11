import ConversationPromptInput from "@/components/chatbot";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: `Hubpot Agent`,
  description: "Enhance your customer relationship management with HubSpot AI Agent. Automate lead management, improve customer engagement, and streamline data handling.",
};
export default function Home() {
  return (
    <div>
      <ConversationPromptInput />
    </div>
  );
}
