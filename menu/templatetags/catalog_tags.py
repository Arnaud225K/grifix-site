from django import template
from django.template import Context, Template
import re

register = template.Library()


def my_safe(value, current_filial):
	t = Template(value)
	c = Context({"current_filial": current_filial})
	text = t.render(c)
	return text


register.filter('my_safe', my_safe)


@register.filter(name='clean_html')
def clean_html(value):
    """
    Remove all HTML tags from the given string.
    """
    if isinstance(value, str):
        return re.sub(r'<.*?>', '', value)  # Remove all HTML tags
    return value

@register.filter(name='remove_space_href')
def remove_space_href(value):
    characters_to_remove = ['-', '(', ')', ' ']
    pattern = '[' +  ''.join(characters_to_remove) +  ']'
    return re.sub(pattern,'', value)