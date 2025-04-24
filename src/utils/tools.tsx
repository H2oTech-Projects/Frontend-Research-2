import { toast } from 'react-toastify';

export const showErrorToast = (messages: any) => {
  let contents: any = [];
  Object.keys(messages).forEach(key => {
    messages[key].forEach((message: string) => {
      contents.push(<li><b>{key}</b>: {message}</li>);
    });
  });

  toast.error(
    <div>
      <ul className="list-disc marker:text-sky-400">{contents}</ul>
    </div>
  );
};

export const showSuccessToast = (messages: any) => {
  toast.success(
    <div>
      {messages}
    </div>
  );
};
