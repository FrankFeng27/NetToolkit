import * as React from "react";
import { Dialog, DialogTitle, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { styled } from "@mui/material/styles";
import { LogInTypeEnum } from "../dataprovider/data-types";

const FormRootContainer = styled('div')(({theme}) => ({
  display: "flex",
  flexDirection: "column",
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2)
}));

const InputContainer = styled('div')(({theme}) => ({
  marginBottom: theme.spacing(2)
}));

const StyledInput = styled('input')(({ theme }) => ({
  display: "block",
  boxSizeing: "border-box",
  width: "80%",
  margin: "auto auto 10px auto",
  fontSize: 16,
}));

export interface ISigInUpData {
  name: string;
  password: string;
  email: string;
}

interface ILoginDialogProps {
  openType: LogInTypeEnum;
  onSubmitSignIn?: (data: ISigInUpData) => Promise<boolean>;
  onSubmitSignUp?: (data: ISigInUpData) => Promise<boolean>;
  onCloseDialog: () => void;
}

const LoginDialog: React.FC<ILoginDialogProps> = (props: ILoginDialogProps) => {
  const { register, handleSubmit } = useForm<ISigInUpData>();
  const dlgType = props.openType;
  
  function onSubmitSignInData(data: ISigInUpData) {
    onCancelDialog();
    if (props.onSubmitSignIn) {
      props.onSubmitSignIn(data);
    }
  }
  function onSubmitSignUpData(data: ISigInUpData) {
    onCancelDialog();
    if (props.onSubmitSignUp) {
      props.onSubmitSignUp(data);
    }
  }

  function onCancelDialog() {
    props.onCloseDialog();
  }
  if (dlgType === LogInTypeEnum.Hide) {
    return (<Dialog open={false} />);
  }
  return dlgType === LogInTypeEnum.SignUp ? (
    <Dialog open={true} onClose={onCancelDialog}>
      <DialogTitle> Sign Up </DialogTitle>
      <form onSubmit={handleSubmit(onSubmitSignUpData)}>
        <FormRootContainer>
          <InputContainer>
          <TextField
            {...register("name")}
            required
            label="Name"
            defaultValue="Your Name"
          />
          </InputContainer>
          <InputContainer>
          <TextField
            {...register("password")}
            required
            label="Password"
            type="password"
          />
          </InputContainer>
          <InputContainer>
          <TextField
            {...register("email")}
            required
            label="E-mail"
            type="email"
          />
          </InputContainer>
        </FormRootContainer>
        <StyledInput type="submit" />
      </form>
    </Dialog>
  ) : (
    <Dialog open={true} onClose={onCancelDialog}>
      <DialogTitle> Sign In </DialogTitle>
      <form onSubmit={handleSubmit(onSubmitSignInData)}>
        <FormRootContainer>
          <InputContainer>
          <TextField
            {...register("name")}
            required
            label="Name or Email"
            defaultValue="Your Name or Email"
          />
          </InputContainer>
          <InputContainer>
          <TextField
            {...register("password")}
            required
            label="Password"
            type="password"
          />
          </InputContainer>
        </FormRootContainer>
        <StyledInput type="submit" />
      </form>
    </Dialog>
  );
  ;
};

export default LoginDialog;
