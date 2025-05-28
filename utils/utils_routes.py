from flask import request, jsonify
from pydantic import BaseModel, Field, ValidationError
from utils.utils_llm import generate_design_idea
import logging

logger = logging.getLogger(__name__)

# Pydantic model for input validation
class DesignRequest(BaseModel):
    role: str = Field(..., min_length=1)
    design_object: str = Field(..., min_length=1)
    parameters: dict = Field(..., min_length=1)
    preferences: str = Field(default="None")

def register_routes(app):
    @app.route('/api/generate-design', methods=['POST'])
    def generate_design():
        try:
            # Validate input
            data = request.get_json()
            logger.info(f"Received request: {data}")

            # Validate role-specific parameters
            required_params = {
                'Interior Designer': ['width', 'length', 'style'],
                'Furniture Designer': ['material', 'width', 'length', 'capacity', 'style'],
                'Artifact Designer': ['medium', 'width', 'height', 'theme']
            }
            if data['role'] not in required_params:
                raise ValueError(f"Invalid role: {data['role']}")
            for param in required_params[data['role']]:
                if param not in data['parameters']:
                    raise ValueError(f"Missing required parameter: {param}")
                if param in ['material', 'medium'] and (not data['parameters'][param] or len(data['parameters'][param]) == 0):
                    raise ValueError(f"At least one {param} must be selected")
                if param not in ['material', 'medium'] and (data['parameters'][param] is None or data['parameters'][param] == ''):
                    raise ValueError(f"Required parameter {param} cannot be empty")

            # Validate using Pydantic
            request_data = DesignRequest(**data)

            # Generate design idea
            design_idea = generate_design_idea(
                role=request_data.role,
                design_object=request_data.design_object,
                parameters=request_data.parameters,
                preferences=request_data.preferences
            )

            return jsonify({
                'status': 'success',
                'design_idea': design_idea,
                'input': request_data.dict()
            }), 200

        except ValidationError as e:
            logger.error(f"Validation error: {e}")
            return jsonify({
                'status': 'error',
                'message': 'Invalid input data',
                'errors': e.errors()
            }), 400
        except ValueError as e:
            logger.error(f"Validation error: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 400
        except Exception as e:
            logger.error(f"Server error: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Internal server error'
            }), 500