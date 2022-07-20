import * as React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { setSpeechText } from "../actions";
import { SpeechPanel, SpeechPanelProps } from "../Components/Widgets/SpeechPanel";
import { SpeechLibraryItem } from "../dataprovider/data-types";
import { DataAccessor } from "../dataprovider/dataprovider";

interface OwnProps {
  isLoggedIn: boolean;
  onOpenSignInDlg: () => void;
  onOpenSignUpDlg: () => void;
}
interface StateProps {
  text: string;
}
interface DispatchProps {
  onTextChanged: (text: string) => void;
}

const mapStateToProps = (state = {speechTool: {}}): StateProps => {
  if (!state.speechTool) {
    state.speechTool = {text: ""};
  }

  return {text: state?.speechTool?.text};
};
const mapDispatchToProps = dispatch => ({
  onTextChanged: text => dispatch(setSpeechText(text)),
});

// test
const libs = [{
  id: 1,
  name: "/test/2022-6-27/memo",
  content: "balahbalah",
  userName: "fengsh",
  configuration: "{\"speed\": 1}"
}, {
  id: 2,
  name: "/test/2022-6-28/thoughts",
  content: "balahbalah",
  userName: "fengsh",
  configuration: "{\"speed\": 1}"
}, {
  id: 3,
  name: "/test/2022-7-7/news",
  content: "balahbalah",
  userName: "fengsh",
  configuration: "{\"speed\": 1}"
}];

const SpeechPanelWrapper: React.FC<SpeechPanelProps> = (props: SpeechPanelProps) => {
  const [libraries, setLibraries] = React.useState<SpeechLibraryItem[]>([]);
  useEffect(() => {
    const res = DataAccessor.getSpeechLibraries();
    setLibraries(libs)
  }, []);

  return (
    <SpeechPanel {...props} libraries={libraries}></SpeechPanel>
  );
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(SpeechPanelWrapper);

