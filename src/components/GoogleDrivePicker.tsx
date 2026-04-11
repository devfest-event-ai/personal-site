import { useCallback, useEffect, useState } from "react";

interface GoogleDrivePickerProps {
  apiKey: string;
  clientId: string;
  onSelect: (url: string) => void;
}

declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      auth: {
        init: (config: {
          apiKey: string;
          clientId: string;
          scope: string;
          discoveryDocs: string[];
        }) => Promise<{
          isSignedIn: {
            get: () => boolean;
          };
          signIn: () => Promise<void>;
          getAuthInstance: () => {
            isSignedIn: { get: () => boolean };
            currentUser: {
              get: () => {
                getAuthResponse: () => { access_token: string };
              };
            };
          };
        }>;
      };
    };
    google: {
      picker: {
        builder: {
          PickerBuilder: new () => {
            addView: (viewId: string) => GooglePickerBuilder;
            setOAuthToken: (token: string) => GooglePickerBuilder;
            setDeveloperKey: (key: string) => GooglePickerBuilder;
            setAppId: (appId: string) => GooglePickerBuilder;
            setCallback: (cb: (data: unknown) => void) => GooglePickerBuilder;
            build: () => { setVisible: (v: boolean) => void };
          };
          ViewId: {
            IMAGE_SEARCH: string;
            DOCS: string;
            DOCS_IMAGES: string;
          };
        };
      };
    };
  }
}

interface GooglePickerBuilder {
  addView: (viewId: string) => GooglePickerBuilder;
  setOAuthToken: (token: string) => GooglePickerBuilder;
  setDeveloperKey: (key: string) => GooglePickerBuilder;
  setAppId: (appId: string) => GooglePickerBuilder;
  setCallback: (cb: (data: unknown) => void) => GooglePickerBuilder;
  build: () => { setVisible: (v: boolean) => void };
}

export default function GoogleDrivePicker({
  apiKey,
  clientId,
  onSelect,
}: GoogleDrivePickerProps) {
  const [loading, setLoading] = useState(false);
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.gapi?.auth) {
      setApiReady(true);
      return;
    }

    const script1 = document.createElement("script");
    script1.src = "https://apis.google.com/js/api.js";
    script1.onload = () => {
      window.gapi.load("client", () => {
        window.gapi.client
          .init({
            apiKey,
            clientId,
            scope: "https://www.googleapis.com/auth/drive.readonly",
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
            ],
          })
          .then(() => setApiReady(true))
          .catch(() => setLoading(false));
      });
    };
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://accounts.google.com/gsi/client";
    document.head.appendChild(script2);
  }, [apiKey, clientId]);

  const openPicker = useCallback(() => {
    if (!apiReady) return;
    setLoading(true);

    const authInstance = window.gapi.auth.getAuthInstance();
    const isSignedIn = authInstance.isSignedIn.get();

    const proceed = () => {
      const token = authInstance.currentUser
        .get()
        .getAuthResponse().access_token;

      const picker = new window.google.picker.builder.PickerBuilder()
        .addView(window.google.picker.builder.ViewId.DOCS_IMAGES)
        .addView(window.google.picker.builder.ViewId.IMAGE_SEARCH)
        .setOAuthToken(token)
        .setDeveloperKey(apiKey)
        .setAppId(clientId.split("-")[0])
        .setCallback((data: unknown) => {
          setLoading(false);
          const action = (data as { action: string }).action;
          if (action === "picked") {
            const docs = (data as { docs: { url: string }[] }).docs;
            if (docs && docs.length > 0) {
              onSelect(docs[0].url);
            }
          }
        })
        .build();

      picker.setVisible(true);
    };

    if (isSignedIn) {
      proceed();
    } else {
      authInstance
        .signIn()
        .then(proceed)
        .catch(() => setLoading(false));
    }
  }, [apiReady, apiKey, clientId, onSelect]);

  return (
    <button
      type="button"
      onClick={openPicker}
      disabled={!apiReady || loading}
      className="px-3 py-2 rounded-md border border-border bg-accent text-foreground text-xs font-medium hover:bg-accent/70 transition-colors whitespace-nowrap flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14.5 22.5H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10l5 5v5.5" />
            <path d="M14 22v-6h6" />
          </svg>
          Pick from Drive
        </>
      )}
    </button>
  );
}
