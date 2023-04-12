import { FileSystemAdapter, normalizePath } from 'obsidian';
import { BSON, EJSON, ObjectId } from '../js/BsonWrapper';
import { IChatSession } from 'components/chat/ConversationDialogue';

import fs from 'fs';
import Weaver from 'main';

export class FileIOManager {
	static async ensureFolderExists(plugin: Weaver, foldername: string): Promise<void> {
		try {
			const adapter = plugin.app.vault.adapter as FileSystemAdapter;
			const backupFolderPath = `/${plugin.settings.weaverFolderPath}/${foldername}`;

			if (!fs.existsSync(adapter.getFullPath(backupFolderPath))) {
				await plugin.app.vault.createFolder(backupFolderPath);
			}
		} catch (error) {
			console.error('Error ensuring backup folder exists:', error);
			throw error;
		}
	}

	static async readLegacyData(plugin: Weaver) {
		const adapter = plugin.app.vault.adapter as FileSystemAdapter;
		const filePath = `/${plugin.settings.weaverFolderPath}/conversations.bson`;
		const arrayBuffer = await adapter.readBinary(filePath);
		const bsonData = new Uint8Array(arrayBuffer);
		const deserializedData = BSON.deserialize(bsonData);
		return deserializedData;
	}

	static async writeToLegacyStorage(plugin: Weaver, data: object): Promise<void> {
		try {
			const adapter = plugin.app.vault.adapter as FileSystemAdapter;
			const bsonData = BSON.serialize(data);
			const buffer = Buffer.from(bsonData.buffer);
			await adapter.writeBinary(`/${plugin.settings.weaverFolderPath}/conversations.bson`, buffer);
		} catch (error) {
			console.error('Error writing data:', error);
			throw error;
		}
	}

	static async writeDescriptor(plugin: Weaver, data: object): Promise<void> {
		try {
			const adapter = plugin.app.vault.adapter as FileSystemAdapter;
			const descriptorPath = `/${plugin.settings.weaverFolderPath}/descriptor.bson`;

			console.log("writeDescriptor", data)

			const bsonData = BSON.serialize(data);
			const buffer = Buffer.from(bsonData.buffer);
			await adapter.writeBinary(descriptorPath, buffer);
		} catch (error) {
			console.error('Error writing descriptor:', error);
			throw error;
		}
	}

	static async readDescriptor(plugin: Weaver): Promise<any> {
		try {
			const adapter = plugin.app.vault.adapter as FileSystemAdapter;
			const descriptorPath = `/${plugin.settings.weaverFolderPath}/descriptor.bson`;

			const arrayBuffer = await adapter.readBinary(descriptorPath);
			const bsonData = new Uint8Array(arrayBuffer);
			const deserializedData = BSON.deserialize(bsonData);

			return deserializedData;
		} catch (error) {
			console.error('Error reading descriptor:', error);
			throw error;
		}
	}
}
