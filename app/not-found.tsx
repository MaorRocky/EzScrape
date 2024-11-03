import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Dont worry, it happens to the best of us.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg:primary/80
            transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back To Dashboard
          </Link>
        </div>
        <footer className="text-sm mt-12 text-muted-foreground">
          If you believe this is a mistake, please contact us
        </footer>
      </div>
    </div>
  );
}

export default NotFoundPage;
