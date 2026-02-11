import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Loader2 } from "lucide-react";
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from "../../services/authService";

export function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form
  const [signupData, setSignupData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await signInWithEmail(loginData.email, loginData.password);
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না!");
      return;
    }

    if (signupData.password.length < 6) {
      setError("পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে!");
      return;
    }

    try {
      setLoading(true);
      await signUpWithEmail(
        signupData.email,
        signupData.password,
        signupData.displayName
      );
      navigate("/");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "সাইন আপ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");

    try {
      setLoading(true);
      await signInWithGoogle();
      navigate("/");
    } catch (err: any) {
      console.error("Google sign in error:", err);
      setError(err.message || "Google দিয়ে লগইন করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">পথিক</h1>
          <p className="text-muted-foreground text-sm">
            যাত্রা শুরু করুন
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">লগইন</TabsTrigger>
            <TabsTrigger value="signup">সাইন আপ</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">ইমেইল</Label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="login-password">পাসওয়ার্ড</Label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    লগইন হচ্ছে...
                  </>
                ) : (
                  "লগইন করুন"
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">নাম</Label>
                <Input
                  id="signup-name"
                  type="text"
                  required
                  placeholder="আপনার নাম"
                  value={signupData.displayName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, displayName: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="signup-email">ইমেইল</Label>
                <Input
                  id="signup-email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="signup-password">পাসওয়ার্ড</Label>
                <Input
                  id="signup-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  অন্তত ৬ অক্ষরের হতে হবে
                </p>
              </div>

              <div>
                <Label htmlFor="signup-confirm">পাসওয়ার্ড নিশ্চিত করুন</Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    সাইন আপ হচ্ছে...
                  </>
                ) : (
                  "সাইন আপ করুন"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              অথবা
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google দিয়ে চালিয়ে যান
        </Button>

        {/* Terms */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          সাইন আপ করার মাধ্যমে, আপনি আমাদের শর্তাবলী এবং গোপনীয়তা নীতি মেনে নিচ্ছেন।
        </p>
      </Card>
    </div>
  );
}
