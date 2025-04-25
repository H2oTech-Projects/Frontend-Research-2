import { toast } from 'react-toastify';

export const showErrorToast = (messages: any) => {
  let contents: any = [];
  Object.keys(messages).forEach(key => {
    messages[key].forEach((message: string) => {
      contents.push(<ul key={key} className="list-disc marker:text-sky-400"><li ><b>{key}</b>: {message}</li></ul>);
    });
  });

  toast.error(
    <div>
      {contents}
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
