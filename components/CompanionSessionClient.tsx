'use client';

import { useState } from 'react';
import { getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import CompanionComponent from "@/components/CompanionComponent";
import { AIChat } from "@/components/AIChat";
import { Button } from "@/components/ui/button";
import { Mic, MessageSquare } from "lucide-react";

interface CompanionSessionClientProps {
  companion: any;
  companionId: string;
  userName: string;
  userImage: string;
}

export const CompanionSessionClient = ({ 
  companion, 
  companionId, 
  userName, 
  userImage 
}: CompanionSessionClientProps) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'chat'>('voice');
  const { name, subject, title, topic, duration, style, voice } = companion;

  return (
    <main>
      <article className="flex rounded-border justify-between p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style={{ backgroundColor: getSubjectColor(subject)}}>
            <Image src={`/icons/${subject}.svg`} alt={subject} width={35} height={35} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-2xl">
                {name}
              </p>
              <div className="subject-badge max-sm:hidden">
                {subject}
              </div>
            </div>
            <p className="text-lg">{topic}</p>
          </div>
        </div>
        <div className="items-start text-2xl max-md:hidden">
          {duration} minutes
        </div>
      </article>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
      <div className="flex gap-2 bg-gray-100 rounded-lg px-2 py-2">
  <Button
    onClick={() => setActiveTab('voice')}
    className={`flex  hover:bg-gray-400 items-center gap-2 ${
      activeTab === 'voice' ? 'bg-gray-200 text-black ' :  ' text-black bg-gray-100'
    }`}
  >
    <Mic className="h-4 w-4" />
  </Button>

  <Button
    onClick={() => setActiveTab('chat')}
    className={`flex hover:bg-gray-400  items-center gap-2 ${
      activeTab === 'chat' ? 'bg-gray-200 text-black' : ' text-black bg-gray-100'
    }`}
  >
    <MessageSquare className="h-4 w-4" />
  </Button>
</div>

      </div>

      {/* Content based on active tab */}
      {activeTab === 'voice' ? (
        <CompanionComponent
          {...companion}
          companionId={companionId}
          userName={userName}
          userImage={userImage}
        />
      ) : (
        <div className="h-[70vh]">
          <AIChat
            companionId={companionId}
            subject={subject}
            topic={topic}
            style={style}
          />
        </div>
      )}
    </main>
  );
};
