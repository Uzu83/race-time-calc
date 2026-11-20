import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CalcForm from "@/components/CalcForm";
import { I18nProvider } from "@/lib/i18n/Provider";
import { useCalcStore } from "@/lib/store";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const STORED_SEC = 1 * 3600 + 39 * 60 + 9;

function renderForm() {
  return render(
    <I18nProvider locale="en">
      <CalcForm />
    </I18nProvider>,
  );
}

describe("CalcForm time readout", () => {
  beforeEach(() => {
    push.mockClear();
    sessionStorage.clear();
    useCalcStore.persist.clearStorage();
    useCalcStore.setState({
      fromKey: "10k",
      fromTimeSec: STORED_SEC,
      toKey: "full",
    });
  });

  it("shows the current valid time and pace under the field", () => {
    renderForm();

    expect(screen.getByLabelText(/Time at that distance/)).toHaveValue("1:39:09");
    expect(screen.getByText("1h 39m 09s")).toBeInTheDocument();
    expect(screen.getByText(/Pace 9'55"\/km/)).toBeInTheDocument();
  });

  it("drops the previous time when the field is abc and shows a format error", () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/Time at that distance/), {
      target: { value: "abc" },
    });

    expect(screen.queryByText("1h 39m 09s")).not.toBeInTheDocument();
    expect(screen.queryByText(/9'55"/)).not.toBeInTheDocument();
    expect(screen.getByText(/Time format is invalid/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Predict/ }));

    expect(push).not.toHaveBeenCalled();
    expect(screen.getByText(/Time format is invalid/)).toBeInTheDocument();
  });

  it("updates the readout when the typed time is valid", () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/Time at that distance/), {
      target: { value: "0:45:30" },
    });

    expect(screen.getByText("0h 45m 30s")).toBeInTheDocument();
    expect(screen.queryByText(/Time format is invalid/)).not.toBeInTheDocument();
  });
});
