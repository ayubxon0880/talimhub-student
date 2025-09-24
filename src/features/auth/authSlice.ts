import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import API from "../../api/axios";

interface AuthState {
    user: any | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: { phone: string; password: string }, thunkAPI) => {
        try {
            const response = await API.post(
                `/auth/login`,
                credentials,
                {
                    headers: {
                        Authorization: undefined
                    }
                }
            );

            console.log("Login response:", response.data);

            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || {message: "Login failed"});
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;

                // ⚠️ Response formatiga qarab moslash
                state.user = action.payload.user || action.payload.data || null;
                state.token = action.payload.token;

                if (state.token) {
                    localStorage.setItem("token", state.token);
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.message || "Login xato!";
            });
    },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;
