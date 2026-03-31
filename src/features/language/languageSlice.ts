import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Language = 'ru' | 'en' | 'de';

interface LanguageState {
    currentLanguage: Language;
}

const initialState: LanguageState = {
    currentLanguage: 'en', // по умолчанию английский
};

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.currentLanguage = action.payload;
        },
    },
});

export const { setLanguage } = languageSlice.actions;

export default languageSlice.reducer;