import { FREE_TRIAL_MODELS } from "core/config/default";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { Button, ButtonSubtext } from "../..";
import { IdeMessengerContext } from "../../../context/IdeMessenger";
import { setDefaultModel } from "../../../redux/slices/stateSlice";
import {
  setDialogMessage,
  setShowDialog,
} from "../../../redux/slices/uiStateSlice";
import { isJetBrains } from "../../../util";
import { setLocalStorage } from "../../../util/localStorage";
import { useSubmitOnboarding } from "../hooks";
import JetBrainsFetchGitHubTokenDialog from "./JetBrainsFetchGitHubTokenDialog";

function QuickstartSubmitButton() {
  const ideMessenger = useContext(IdeMessengerContext);
  const dispatch = useDispatch();

  const { submitOnboarding } = useSubmitOnboarding("Quickstart");

  function onComplete() {
    setLocalStorage("signedInToGh", true);
    submitOnboarding();

    // Set Sonnet as the default model
    dispatch(
      setDefaultModel({ title: FREE_TRIAL_MODELS[0].title, force: true }),
    );
  }

  function openJetBrainsDialog() {
    dispatch(setShowDialog(true));
    dispatch(
      setDialogMessage(
        <JetBrainsFetchGitHubTokenDialog onComplete={onComplete} />,
      ),
    );
  }

  async function fetchGitHubAuthToken() {
    const result = await ideMessenger.request("getGitHubAuthToken", undefined);
    if (result.status === "success") {
      onComplete();
    }
  }

  async function onClick() {
    if (isJetBrains()) {
      openJetBrainsDialog();
    } else {
      await fetchGitHubAuthToken();
    }
  }

  return (
    <div className="mt-4 w-full">
      <Button
        onClick={onClick}
        className="grid grid-flow-col items-center gap-2 w-full"
      >
        Get started using our API keys
      </Button>
      <ButtonSubtext>Try 50 chat and 2k autocomplete requests</ButtonSubtext>
    </div>
  );
}

export default QuickstartSubmitButton;