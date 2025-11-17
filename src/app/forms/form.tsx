import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export function Form() {
  return (
    <ShowcaseSection title="Contact Form" className="!p-6.5">
      <form action="#">

        <InputGroup
          label="Title"
          type="text"
          placeholder="Enter Title"
          className="mb-4.5"
          required
        />

        <InputGroup
          label="Description"
          type="text"
          placeholder="Enter your subject"
          className="mb-4.5"
        />

        <TextAreaGroup label="Message" placeholder="Type your message" />

        <button className="mt-6 flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
          Send Message
        </button>
      </form>
    </ShowcaseSection>
  );
}
