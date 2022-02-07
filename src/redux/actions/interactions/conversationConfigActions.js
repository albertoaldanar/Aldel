export const SET_CONVERSATION_CONFIG = 'SET_CONVERSATION_CONFIG';

export default function setConversationConfig(object) {
    return {
      type: SET_CONVERSATION_CONFIG,
      payload: object
    }
}
