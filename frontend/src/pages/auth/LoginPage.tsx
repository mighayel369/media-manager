import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { AuthService } from "../../features/auth/services/auth.service";

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormError(null);
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        try {
            const response = await AuthService.login(formData);
            console.log(response)
            localStorage.setItem("accessToken", response.token)
            localStorage.setItem('user', JSON.stringify(response.user));
            navigate("/");
        } catch (error: unknown) {
            const serverMessage =
                error instanceof Error
                    ? error.message
                    : "Registration failed. Please try again.";

            setFormError(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col justify-center animate-fade-in">

            <div className="mb-8 text-left">
                <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
                    Welcome back
                </h1>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    Enter your credentials to manage your media assets securely.
                </p>
            </div>

            {formError && (
                <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl text-left flex items-center gap-2 animate-fade-in">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    {formError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="hover:border-slate-700 focus:border-purple-500 transition-colors"
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="hover:border-slate-700 focus:border-purple-500 transition-colors"
                />

                <Button type="submit" isLoading={loading} className="mt-3 py-3 shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]">
                    Sign In to Dashboard
                </Button>
            </form>

            <p className="text-sm text-slate-500 text-center mt-8 font-medium">
                New to the platform?{" "}
                <Link
                    to="/register"
                    className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 decoration-purple-500/30 hover:decoration-purple-400 transition-all"
                >
                    Create an account
                </Link>
            </p>

        </div>
    );
};