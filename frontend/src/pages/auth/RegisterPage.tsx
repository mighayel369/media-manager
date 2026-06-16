import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { AuthService } from "../../features/auth/services/auth.service";

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
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

            const response = await AuthService.register(formData);
            if (response.success) {
                navigate("/login");
            }

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

            <div className="mb-6 text-left">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
                    Create your account
                </h1>
                <p className="text-sm text-slate-400">
                    Join Media Hub to upload, manage, and secure your images.
                </p>
            </div>

            {formError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-left animate-fade-in">
                    {formError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleChange}
                />

                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                />

                <Button type="submit" isLoading={loading} className="mt-2">
                    Create Account
                </Button>
            </form>

            <p className="text-sm text-slate-400 text-center mt-6">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                    Sign in
                </Link>
            </p>

        </div>
    );
};