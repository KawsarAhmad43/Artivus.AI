from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

def generate_design_idea(role: str, design_object: str, parameters: dict, preferences: str) -> str:
    try:
        # Initialize LLM
        llm = ChatOllama(
            model="llama3-chatqa:8b",
            base_url=os.getenv("OLLAMA_HOST", "http://localhost:11434"),
            temperature=0.7
        )

        # Format parameters
        param_strings = []
        for key, value in parameters.items():
            if key == 'width' or key == 'length':
                unit = 'cm' if role == 'Artifact Designer' else 'meters'
                param_strings.append(f"{key.capitalize()}: {value} {unit}")
            elif key == 'height':
                param_strings.append(f"Height: {value} cm")
            elif key == 'capacity':
                param_strings.append(f"Capacity: {value} seats/people")
            elif key in ['material', 'medium']:
                param_strings.append(f"{key.capitalize()}: {', '.join(value) if value else 'None'}")
            else:
                param_strings.append(f"{key.capitalize()}: {value}")
        param_text = "\n- ".join([''] + param_strings)

        # Prompt template
        template = """
        You are a 20-year experienced {role}. Generate a detailed design idea for a {design_object} with the following specifications:
        {param_text}
        - Preferences: {preferences}

        Provide a creative design idea in 100-150 words.
        """
        prompt = ChatPromptTemplate.from_template(template)

        # Create chain
        chain = prompt | llm

        # Invoke LLM
        response = chain.invoke({
            "role": role,
            "design_object": design_object,
            "param_text": param_text,
            "preferences": preferences
        })

        logger.info("Design idea generated")
        return response.content

    except Exception as e:
        logger.error(f"Error generating design: {str(e)}")
        raise