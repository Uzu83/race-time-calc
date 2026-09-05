import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import FeedbackEntry from "@/components/FeedbackEntry";
import { isFeedbackUiAllowed, submitFeedback } from "@/lib/feedback/client";
import { I18nProvider } from "@/lib/i18n/Provider";

vi.mock("@/lib/feedback/client", () => ({
  isFeedbackUiAllowed: vi.fn(),
  submitFeedback: vi.fn(),
  FEEDBACK_KINDS: ["bug", "feature", "ux", "other"],
}));

// jsdom does not implement HTMLDialogElement methods out of the box.
beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      this.open = false;
    };
  }
});

describe("FeedbackEntry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProvider = () => {
    return render(
      <I18nProvider locale="ja">
        <FeedbackEntry />
      </I18nProvider>,
    );
  };

  it("does not render opener when isFeedbackUiAllowed is false (ac-7c)", () => {
    vi.mocked(isFeedbackUiAllowed).mockReturnValue(false);
    renderWithProvider();

    expect(screen.queryByRole("button", { name: "フィードバック" })).not.toBeInTheDocument();
  });

  describe("when isFeedbackUiAllowed is true", () => {
    beforeEach(() => {
      vi.mocked(isFeedbackUiAllowed).mockReturnValue(true);
      vi.mocked(submitFeedback).mockResolvedValue({ ok: true, id: "test" });
    });

    it("opens and closes the dialog via buttons (ac-7a, ac-7b)", () => {
      renderWithProvider();

      const opener = screen.getByRole("button", { name: "フィードバック" });
      expect(opener).toBeInTheDocument();

      // Dialog should be initially closed (not in DOM or open attribute is false)
      const dialog = document.querySelector("dialog") as HTMLDialogElement;
      expect(dialog).not.toBeNull();
      expect(dialog.open).toBe(false);

      // Open dialog
      fireEvent.click(opener);
      expect(dialog.open).toBe(true);

      // Close dialog via close button
      const closeBtn = screen.getByRole("button", { name: "閉じる" });
      fireEvent.click(closeBtn);
      expect(dialog.open).toBe(false);
    });

    it("closes the dialog when Escape / cancel event is fired (ac-7b)", () => {
      renderWithProvider();

      const opener = screen.getByRole("button", { name: "フィードバック" });
      fireEvent.click(opener);

      const dialog = document.querySelector("dialog") as HTMLDialogElement;
      expect(dialog.open).toBe(true);

      // Fire cancel event (what Escape does natively on <dialog>)
      fireEvent(dialog, new Event("cancel", { cancelable: true }));
      expect(dialog.open).toBe(false);
    });

    it("closes the dialog when clicking outside the panel (backdrop, ac-7b)", () => {
      renderWithProvider();

      fireEvent.click(screen.getByRole("button", { name: "フィードバック" }));
      const dialog = document.querySelector("dialog") as HTMLDialogElement;
      expect(dialog.open).toBe(true);

      // Outside the dialog box (getBoundingClientRect is 0 in jsdom → any positive coords work)
      fireEvent.pointerDown(document, { clientX: 1, clientY: 1 });
      expect(dialog.open).toBe(false);
    });
  });
});
