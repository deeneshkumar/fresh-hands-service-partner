import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from 'react-native';
import { COLORS } from '../../constants/colors';
import { THEME } from '../../constants/theme';
import { Send, ArrowLeft, Bot } from 'lucide-react-native';
import { sendToGemini } from '../../services/gemini';

export default function ChatScreen({ navigation }) {
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hello Partner! How can we help you today?', sender: 'bot', timestamp: new Date().toLocaleTimeString() }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef(null);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userText = inputText.trim();
        const newUserMsg = {
            id: Date.now().toString(),
            text: userText,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            // Get AI Response
            const reply = await sendToGemini([...messages, newUserMsg]);

            const botMsg = {
                id: (Date.now() + 1).toString(),
                text: reply,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    const renderItem = ({ item }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.msgWrapper, isUser ? styles.msgWrapperUser : styles.msgWrapperBot]}>
                {!isUser && (
                    <View style={styles.botAvatar}>
                        <Bot size={16} color={COLORS.white} />
                    </View>
                )}
                <View style={[styles.msgBubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
                    <Text style={[styles.msgText, isUser ? styles.textUser : styles.textBot]}>{item.text}</Text>
                    <Text style={[styles.timestamp, isUser ? styles.timeUser : styles.timeBot]}>{item.timestamp}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Fresh Hands Support</Text>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    ListFooterComponent={
                        isTyping ? (
                            <View style={styles.typingContainer}>
                                <Text style={styles.typingText}>Support is typing...</Text>
                            </View>
                        ) : null
                    }
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        placeholderTextColor={COLORS.textLight}
                        value={inputText}
                        onChangeText={setInputText}
                        editable={!isTyping}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, isTyping && styles.sendBtnDisabled]}
                        onPress={handleSend}
                        disabled={isTyping}
                    >
                        <Send size={20} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.m,
        paddingVertical: 14,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        elevation: 2,
    },
    backBtn: {
        marginRight: 16,
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
    },
    listContent: {
        padding: THEME.spacing.m,
        paddingBottom: 20,
    },
    typingContainer: {
        padding: 10,
        marginLeft: 40,
    },
    typingText: {
        color: COLORS.textLight,
        fontStyle: 'italic',
        fontSize: 12,
    },
    msgWrapper: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    msgWrapperUser: {
        justifyContent: 'flex-end',
    },
    msgWrapperBot: {
        justifyContent: 'flex-start',
    },
    botAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    msgBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        elevation: 1,
    },
    bubbleUser: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },
    bubbleBot: {
        backgroundColor: COLORS.surface,
        borderBottomLeftRadius: 4,
    },
    msgText: {
        fontSize: 16,
        lineHeight: 22,
    },
    textUser: {
        color: COLORS.white,
    },
    textBot: {
        color: COLORS.text,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    timeUser: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    timeBot: {
        color: COLORS.textLight,
    },
    sendBtnDisabled: {
        opacity: 0.5,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: THEME.spacing.m,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.background,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
