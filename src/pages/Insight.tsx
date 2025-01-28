import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
interface EmailProps {
    value: string;
    label: string;
}
const Insight = () => {
    const [selectedEmail, setSelectedEmail] = React.useState<string>("");
    const emailList: EmailProps[] = [
        {
            value: "johndoe@example.com",
            label: "johndoe@example.com"
        },
        {
            value: "janesmith@fake.com",
            label: "janesmith@fake.com"
        },
        {
            value: "alice.smith@test.org",
            label: "alice.smith@test.org"
        },
        {
            value: "robert_johnson@dummy.net",
            label: "robert_johnson@dummy.net"
        },
        {
            value: "sarah.miller@mock.io",
            label: "sarah.miller@mock.io"
        },
    ]
    return <div className="flex flex-col px-3 py-2">
        <div className="text-xl font-medium text-royalBlue dark:text-white">Madera Allocation Report</div>
        <div className="flex  items-center mt-2 dark:text-slate-50">
            <div className="flex items-center gap-2">
                <label>Select an Account : </label>
                <Select onValueChange={(value) => setSelectedEmail(value)}>
                    <SelectTrigger className="w-56 h-8 transition-colors">
                        <SelectValue placeholder="Select an email" />
                    </SelectTrigger>
                    <SelectContent>
                        {emailList.map((email) => (
                            <SelectItem key={email.value} value={email.value}>
                                {email.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    </div>;
};

export default Insight;
