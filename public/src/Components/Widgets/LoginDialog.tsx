import * as React from "react";
import { Dialog, DialogTitle, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { styled } from "@material-ui/core/styles";
import { LogInTypeEnum } from "../../dataprovider/data-types";

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

export interface IFormInput {
  name: string;
  password: string;
  email: string;
}

interface ILoginDialogProps {
  openType: LogInTypeEnum;
  onCancel: () => void;
  onSubmitSignIn?: (data: IFormInput) => Promise<boolean>;
  onSubmitSignUp?: (data: IFormInput) => Promise<boolean>;
}

const LoginDialog: React.FC<ILoginDialogProps> = (props: ILoginDialogProps) => {
  const { register, handleSubmit } = useForm<IFormInput>();
  
  function onSubmitSignInData(data: IFormInput) {
    if (props.onSubmitSignIn) {
      props.onSubmitSignIn(data);
    }
  }
  function onSubmitSignUpData(data: IFormInput) {
    if (props.onSubmitSignUp) {
      props.onSubmitSignUp(data);
    }
  }

  function onCancelDialog() {
    props.onCancel();
  }
  const open = props.openType !== LogInTypeEnum.Hide;
  if (!open) {
    return (<Dialog open={false} />);
  }
  return props.openType === LogInTypeEnum.SignUp ? (
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
