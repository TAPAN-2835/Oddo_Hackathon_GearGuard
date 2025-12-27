import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, UserPlus, Check, X, AlertCircle } from 'lucide-react';
import { signUp } from '@/services/auth.service';
import { toast } from '@/hooks/use-toast';

export default function SignUp() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const passwordRequirements = [
        { label: 'At least 8 characters', met: formData.password.length >= 8 },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
        { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
        { label: 'Contains number', met: /[0-9]/.test(formData.password) },
        { label: 'Contains special character', met: /[!@#$%^&*]/.test(formData.password) },
    ];

    const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordsMatch || !passwordRequirements.every((req) => req.met)) {
            setError('Please meet all password requirements');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await signUp(formData.email, formData.password, formData.name);
            toast({
                title: 'Account Created!',
                description: 'Your account has been created successfully. Please sign in.',
            });
            navigate('/login');
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'Failed to create account. Please try again.');
            toast({
                title: 'Signup Failed',
                description: err.message || 'Failed to create account.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background py-12">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>

            {/* SignUp Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <Card className="p-8 bg-card backdrop-blur-sm border shadow-lg">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
                                <img src="/logo.png" alt="GearGuard" className="w-12 h-12 object-contain" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-semibold text-foreground mb-2">Create your account</h1>
                        <p className="text-sm text-muted-foreground">Join GearGuard today</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-foreground">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="h-11 bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="h-11 bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="h-11 bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Re-enter your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="h-11 bg-background border-input focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formData.confirmPassword && (
                                <p
                                    className={`text-xs flex items-center gap-1 ${passwordsMatch ? 'text-success' : 'text-destructive'
                                        }`}
                                >
                                    {passwordsMatch ? (
                                        <>
                                            <Check className="w-3 h-3" /> Passwords match
                                        </>
                                    ) : (
                                        <>
                                            <X className="w-3 h-3" /> Passwords do not match
                                        </>
                                    )}
                                </p>
                            )}
                        </div>

                        {/* Password Requirements */}
                        {formData.password && (
                            <div className="space-y-1 p-3 bg-background/50 rounded-lg border border-border/50">
                                <p className="text-xs font-medium text-foreground mb-2">Password must contain:</p>
                                {passwordRequirements.map((req, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs">
                                        {req.met ? (
                                            <Check className="w-3 h-3 text-success" />
                                        ) : (
                                            <X className="w-3 h-3 text-muted-foreground" />
                                        )}
                                        <span className={req.met ? 'text-success' : 'text-muted-foreground'}>
                                            {req.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm hover:shadow transition-all"
                            disabled={!passwordsMatch || !passwordRequirements.every((req) => req.met)}
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Create Account
                        </Button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center">
                        <div className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
                            >
                                Sign in
                            </button>
                        </div>
                    </div>
                </Card>


            </motion.div>
        </div>
    );
}
