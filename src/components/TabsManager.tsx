import Weaver from 'main'
import React, { useEffect, useState } from 'react';

import { HomePage } from './HomePage';
import { ChatView } from './ChatView';

export interface TabsManagerProps {
	plugin: Weaver
}

export const TabsManager: React.FC<TabsManagerProps> = ({ plugin }) => {
	const [activeTab, setActiveTab] = useState('home-page');
	const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
	const [lastActiveConversationId, setLastActiveConversationId] = useState<number | null>(null);

	const handleTabSwitch = () => {
		setActiveTab('chat-view');
	}

	const handleConversationSelect = (conversationId: number) => {
		setSelectedConversationId(conversationId);
	};

	return (
		<div className="tabs-manager">
			{activeTab === 'home-page' ? (
				<HomePage plugin={plugin} onTabSwitch={handleTabSwitch} onConversationLoad={handleConversationSelect}/>
			) : (
				<ChatView
					plugin={plugin}
					selectedConversationId={selectedConversationId}
					lastActiveConversationId={lastActiveConversationId}
					setLastActiveConversationId={setLastActiveConversationId}
				/>
			)}
		</div>
	)
}
