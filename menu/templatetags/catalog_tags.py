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


@register.filter(name='get_material_word')
def get_material_word(count):
    if count % 10 == 1 and count % 100 != 11:
        return "материал"
    elif count % 10 in [2, 3, 4] and not (count % 100 in [12, 13, 14]):
        return "материала"
    else:
        return "материалов"
    

@register.filter(name='format_price')
def format_price(value):
    if value is not None:
        return f"{value:,.0f}".replace(",", " ")
    return "0"