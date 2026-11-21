import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CalcForm from "@/components/CalcForm";
import { DISTANCES } from "@/lib/distance";
import { I18nProvider } from "@/lib/i18n/Provider";
import { consensusSeconds, predictAll } from "@/lib/predict";
import { useCalcStore } from "@/lib/store";
import { formatTime } from "@/lib/time";

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

  it("keeps each typed character instead of reformatting a partial time", () => {
    useCalcStore.setState({ fromKey: "5k", fromTimeSec: 25 * 60, toKey: "full" });
    renderForm();

    fireEvent.click(
      within(screen.getByRole("group", { name: /Current best distance/ })).getByRole("button", {
        name: "10K",
      }),
    );
    fireEvent.click(
      within(screen.getByRole("group", { name: /Predict for/ })).getByRole("button", {
        name: "Half",
      }),
    );

    const input = screen.getByLabelText(/Time at that distance/) as HTMLInputElement;
    typeChars(input, "0:50:00");

    expect(input).toHaveValue("0:50:00");
    expect(screen.queryByText(/Time format is invalid/)).not.toBeInTheDocument();

    const halfSec = consensusSeconds(predictAll(DISTANCES["10k"], 50 * 60, DISTANCES.half));
    const halfLabel = formatTime(halfSec, { forceHours: true });
    expect(halfLabel).toBe("1:52:46");
    expect(screen.getByText(halfLabel)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Predict/ }));
    expect(push).toHaveBeenCalledTimes(1);
  });

  it("accepts 50:00 as typed and still predicts", () => {
    useCalcStore.setState({ fromKey: "10k", fromTimeSec: 25 * 60, toKey: "half" });
    renderForm();

    const input = screen.getByLabelText(/Time at that distance/) as HTMLInputElement;
    typeChars(input, "50:00");

    expect(input).toHaveValue("50:00");
    expect(screen.queryByText(/Time format is invalid/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Predict/ }));
    expect(push).toHaveBeenCalledTimes(1);
  });

  it("still fills the field from the store when the user is not editing", () => {
    renderForm();

    act(() => {
      useCalcStore.setState({ fromTimeSec: 45 * 60 });
    });

    expect(screen.getByLabelText(/Time at that distance/)).toHaveValue("0:45:00");
  });
});

function typeChars(input: HTMLInputElement, text: string) {
  fireEvent.focus(input);
  let current = "";
  for (const ch of text) {
    fireEvent.change(input, { target: { value: current + ch } });
    current = input.value;
  }
}
