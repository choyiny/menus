from .templates.template import GridTemplate, RowTemplate


class TemplateFactory:
    @staticmethod
    def get_template(template: str, content: bytes, **kwargs):
        if template is "row":
            return RowTemplate(content, **kwargs)
        elif template is "grid":
            return GridTemplate(content, **kwargs)
        else:
            return None
