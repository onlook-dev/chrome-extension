import pathLib from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var shallowEqual_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shallowEqual;
function shallowEqual(actual, expected) {
  const keys = Object.keys(expected);
  for (const key of keys) {
    if (actual[key] !== expected[key]) {
      return false;
    }
  }
  return true;
}


});

unwrapExports(shallowEqual_1);

var deprecationWarning_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deprecationWarning;
const warnings = new Set();
function deprecationWarning(oldName, newName, prefix = "") {
  if (warnings.has(oldName)) return;
  warnings.add(oldName);
  const {
    internal,
    trace
  } = captureShortStackTrace(1, 2);
  if (internal) {
    return;
  }
  console.warn(`${prefix}\`${oldName}\` has been deprecated, please migrate to \`${newName}\`\n${trace}`);
}
function captureShortStackTrace(skip, length) {
  const {
    stackTraceLimit,
    prepareStackTrace
  } = Error;
  let stackTrace;
  Error.stackTraceLimit = 1 + skip + length;
  Error.prepareStackTrace = function (err, stack) {
    stackTrace = stack;
  };
  new Error().stack;
  Error.stackTraceLimit = stackTraceLimit;
  Error.prepareStackTrace = prepareStackTrace;
  if (!stackTrace) return {
    internal: false,
    trace: ""
  };
  const shortStackTrace = stackTrace.slice(1 + skip, 1 + skip + length);
  return {
    internal: /[\\/]@babel[\\/]/.test(shortStackTrace[1].getFileName()),
    trace: shortStackTrace.map(frame => `    at ${frame}`).join("\n")
  };
}


});

unwrapExports(deprecationWarning_1);

var generated$3 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAccessor = isAccessor;
exports.isAnyTypeAnnotation = isAnyTypeAnnotation;
exports.isArgumentPlaceholder = isArgumentPlaceholder;
exports.isArrayExpression = isArrayExpression;
exports.isArrayPattern = isArrayPattern;
exports.isArrayTypeAnnotation = isArrayTypeAnnotation;
exports.isArrowFunctionExpression = isArrowFunctionExpression;
exports.isAssignmentExpression = isAssignmentExpression;
exports.isAssignmentPattern = isAssignmentPattern;
exports.isAwaitExpression = isAwaitExpression;
exports.isBigIntLiteral = isBigIntLiteral;
exports.isBinary = isBinary;
exports.isBinaryExpression = isBinaryExpression;
exports.isBindExpression = isBindExpression;
exports.isBlock = isBlock;
exports.isBlockParent = isBlockParent;
exports.isBlockStatement = isBlockStatement;
exports.isBooleanLiteral = isBooleanLiteral;
exports.isBooleanLiteralTypeAnnotation = isBooleanLiteralTypeAnnotation;
exports.isBooleanTypeAnnotation = isBooleanTypeAnnotation;
exports.isBreakStatement = isBreakStatement;
exports.isCallExpression = isCallExpression;
exports.isCatchClause = isCatchClause;
exports.isClass = isClass;
exports.isClassAccessorProperty = isClassAccessorProperty;
exports.isClassBody = isClassBody;
exports.isClassDeclaration = isClassDeclaration;
exports.isClassExpression = isClassExpression;
exports.isClassImplements = isClassImplements;
exports.isClassMethod = isClassMethod;
exports.isClassPrivateMethod = isClassPrivateMethod;
exports.isClassPrivateProperty = isClassPrivateProperty;
exports.isClassProperty = isClassProperty;
exports.isCompletionStatement = isCompletionStatement;
exports.isConditional = isConditional;
exports.isConditionalExpression = isConditionalExpression;
exports.isContinueStatement = isContinueStatement;
exports.isDebuggerStatement = isDebuggerStatement;
exports.isDecimalLiteral = isDecimalLiteral;
exports.isDeclaration = isDeclaration;
exports.isDeclareClass = isDeclareClass;
exports.isDeclareExportAllDeclaration = isDeclareExportAllDeclaration;
exports.isDeclareExportDeclaration = isDeclareExportDeclaration;
exports.isDeclareFunction = isDeclareFunction;
exports.isDeclareInterface = isDeclareInterface;
exports.isDeclareModule = isDeclareModule;
exports.isDeclareModuleExports = isDeclareModuleExports;
exports.isDeclareOpaqueType = isDeclareOpaqueType;
exports.isDeclareTypeAlias = isDeclareTypeAlias;
exports.isDeclareVariable = isDeclareVariable;
exports.isDeclaredPredicate = isDeclaredPredicate;
exports.isDecorator = isDecorator;
exports.isDirective = isDirective;
exports.isDirectiveLiteral = isDirectiveLiteral;
exports.isDoExpression = isDoExpression;
exports.isDoWhileStatement = isDoWhileStatement;
exports.isEmptyStatement = isEmptyStatement;
exports.isEmptyTypeAnnotation = isEmptyTypeAnnotation;
exports.isEnumBody = isEnumBody;
exports.isEnumBooleanBody = isEnumBooleanBody;
exports.isEnumBooleanMember = isEnumBooleanMember;
exports.isEnumDeclaration = isEnumDeclaration;
exports.isEnumDefaultedMember = isEnumDefaultedMember;
exports.isEnumMember = isEnumMember;
exports.isEnumNumberBody = isEnumNumberBody;
exports.isEnumNumberMember = isEnumNumberMember;
exports.isEnumStringBody = isEnumStringBody;
exports.isEnumStringMember = isEnumStringMember;
exports.isEnumSymbolBody = isEnumSymbolBody;
exports.isExistsTypeAnnotation = isExistsTypeAnnotation;
exports.isExportAllDeclaration = isExportAllDeclaration;
exports.isExportDeclaration = isExportDeclaration;
exports.isExportDefaultDeclaration = isExportDefaultDeclaration;
exports.isExportDefaultSpecifier = isExportDefaultSpecifier;
exports.isExportNamedDeclaration = isExportNamedDeclaration;
exports.isExportNamespaceSpecifier = isExportNamespaceSpecifier;
exports.isExportSpecifier = isExportSpecifier;
exports.isExpression = isExpression;
exports.isExpressionStatement = isExpressionStatement;
exports.isExpressionWrapper = isExpressionWrapper;
exports.isFile = isFile;
exports.isFlow = isFlow;
exports.isFlowBaseAnnotation = isFlowBaseAnnotation;
exports.isFlowDeclaration = isFlowDeclaration;
exports.isFlowPredicate = isFlowPredicate;
exports.isFlowType = isFlowType;
exports.isFor = isFor;
exports.isForInStatement = isForInStatement;
exports.isForOfStatement = isForOfStatement;
exports.isForStatement = isForStatement;
exports.isForXStatement = isForXStatement;
exports.isFunction = isFunction;
exports.isFunctionDeclaration = isFunctionDeclaration;
exports.isFunctionExpression = isFunctionExpression;
exports.isFunctionParent = isFunctionParent;
exports.isFunctionTypeAnnotation = isFunctionTypeAnnotation;
exports.isFunctionTypeParam = isFunctionTypeParam;
exports.isGenericTypeAnnotation = isGenericTypeAnnotation;
exports.isIdentifier = isIdentifier;
exports.isIfStatement = isIfStatement;
exports.isImmutable = isImmutable;
exports.isImport = isImport;
exports.isImportAttribute = isImportAttribute;
exports.isImportDeclaration = isImportDeclaration;
exports.isImportDefaultSpecifier = isImportDefaultSpecifier;
exports.isImportExpression = isImportExpression;
exports.isImportNamespaceSpecifier = isImportNamespaceSpecifier;
exports.isImportOrExportDeclaration = isImportOrExportDeclaration;
exports.isImportSpecifier = isImportSpecifier;
exports.isIndexedAccessType = isIndexedAccessType;
exports.isInferredPredicate = isInferredPredicate;
exports.isInterfaceDeclaration = isInterfaceDeclaration;
exports.isInterfaceExtends = isInterfaceExtends;
exports.isInterfaceTypeAnnotation = isInterfaceTypeAnnotation;
exports.isInterpreterDirective = isInterpreterDirective;
exports.isIntersectionTypeAnnotation = isIntersectionTypeAnnotation;
exports.isJSX = isJSX;
exports.isJSXAttribute = isJSXAttribute;
exports.isJSXClosingElement = isJSXClosingElement;
exports.isJSXClosingFragment = isJSXClosingFragment;
exports.isJSXElement = isJSXElement;
exports.isJSXEmptyExpression = isJSXEmptyExpression;
exports.isJSXExpressionContainer = isJSXExpressionContainer;
exports.isJSXFragment = isJSXFragment;
exports.isJSXIdentifier = isJSXIdentifier;
exports.isJSXMemberExpression = isJSXMemberExpression;
exports.isJSXNamespacedName = isJSXNamespacedName;
exports.isJSXOpeningElement = isJSXOpeningElement;
exports.isJSXOpeningFragment = isJSXOpeningFragment;
exports.isJSXSpreadAttribute = isJSXSpreadAttribute;
exports.isJSXSpreadChild = isJSXSpreadChild;
exports.isJSXText = isJSXText;
exports.isLVal = isLVal;
exports.isLabeledStatement = isLabeledStatement;
exports.isLiteral = isLiteral;
exports.isLogicalExpression = isLogicalExpression;
exports.isLoop = isLoop;
exports.isMemberExpression = isMemberExpression;
exports.isMetaProperty = isMetaProperty;
exports.isMethod = isMethod;
exports.isMiscellaneous = isMiscellaneous;
exports.isMixedTypeAnnotation = isMixedTypeAnnotation;
exports.isModuleDeclaration = isModuleDeclaration;
exports.isModuleExpression = isModuleExpression;
exports.isModuleSpecifier = isModuleSpecifier;
exports.isNewExpression = isNewExpression;
exports.isNoop = isNoop;
exports.isNullLiteral = isNullLiteral;
exports.isNullLiteralTypeAnnotation = isNullLiteralTypeAnnotation;
exports.isNullableTypeAnnotation = isNullableTypeAnnotation;
exports.isNumberLiteral = isNumberLiteral;
exports.isNumberLiteralTypeAnnotation = isNumberLiteralTypeAnnotation;
exports.isNumberTypeAnnotation = isNumberTypeAnnotation;
exports.isNumericLiteral = isNumericLiteral;
exports.isObjectExpression = isObjectExpression;
exports.isObjectMember = isObjectMember;
exports.isObjectMethod = isObjectMethod;
exports.isObjectPattern = isObjectPattern;
exports.isObjectProperty = isObjectProperty;
exports.isObjectTypeAnnotation = isObjectTypeAnnotation;
exports.isObjectTypeCallProperty = isObjectTypeCallProperty;
exports.isObjectTypeIndexer = isObjectTypeIndexer;
exports.isObjectTypeInternalSlot = isObjectTypeInternalSlot;
exports.isObjectTypeProperty = isObjectTypeProperty;
exports.isObjectTypeSpreadProperty = isObjectTypeSpreadProperty;
exports.isOpaqueType = isOpaqueType;
exports.isOptionalCallExpression = isOptionalCallExpression;
exports.isOptionalIndexedAccessType = isOptionalIndexedAccessType;
exports.isOptionalMemberExpression = isOptionalMemberExpression;
exports.isParenthesizedExpression = isParenthesizedExpression;
exports.isPattern = isPattern;
exports.isPatternLike = isPatternLike;
exports.isPipelineBareFunction = isPipelineBareFunction;
exports.isPipelinePrimaryTopicReference = isPipelinePrimaryTopicReference;
exports.isPipelineTopicExpression = isPipelineTopicExpression;
exports.isPlaceholder = isPlaceholder;
exports.isPrivate = isPrivate;
exports.isPrivateName = isPrivateName;
exports.isProgram = isProgram;
exports.isProperty = isProperty;
exports.isPureish = isPureish;
exports.isQualifiedTypeIdentifier = isQualifiedTypeIdentifier;
exports.isRecordExpression = isRecordExpression;
exports.isRegExpLiteral = isRegExpLiteral;
exports.isRegexLiteral = isRegexLiteral;
exports.isRestElement = isRestElement;
exports.isRestProperty = isRestProperty;
exports.isReturnStatement = isReturnStatement;
exports.isScopable = isScopable;
exports.isSequenceExpression = isSequenceExpression;
exports.isSpreadElement = isSpreadElement;
exports.isSpreadProperty = isSpreadProperty;
exports.isStandardized = isStandardized;
exports.isStatement = isStatement;
exports.isStaticBlock = isStaticBlock;
exports.isStringLiteral = isStringLiteral;
exports.isStringLiteralTypeAnnotation = isStringLiteralTypeAnnotation;
exports.isStringTypeAnnotation = isStringTypeAnnotation;
exports.isSuper = isSuper;
exports.isSwitchCase = isSwitchCase;
exports.isSwitchStatement = isSwitchStatement;
exports.isSymbolTypeAnnotation = isSymbolTypeAnnotation;
exports.isTSAnyKeyword = isTSAnyKeyword;
exports.isTSArrayType = isTSArrayType;
exports.isTSAsExpression = isTSAsExpression;
exports.isTSBaseType = isTSBaseType;
exports.isTSBigIntKeyword = isTSBigIntKeyword;
exports.isTSBooleanKeyword = isTSBooleanKeyword;
exports.isTSCallSignatureDeclaration = isTSCallSignatureDeclaration;
exports.isTSConditionalType = isTSConditionalType;
exports.isTSConstructSignatureDeclaration = isTSConstructSignatureDeclaration;
exports.isTSConstructorType = isTSConstructorType;
exports.isTSDeclareFunction = isTSDeclareFunction;
exports.isTSDeclareMethod = isTSDeclareMethod;
exports.isTSEntityName = isTSEntityName;
exports.isTSEnumDeclaration = isTSEnumDeclaration;
exports.isTSEnumMember = isTSEnumMember;
exports.isTSExportAssignment = isTSExportAssignment;
exports.isTSExpressionWithTypeArguments = isTSExpressionWithTypeArguments;
exports.isTSExternalModuleReference = isTSExternalModuleReference;
exports.isTSFunctionType = isTSFunctionType;
exports.isTSImportEqualsDeclaration = isTSImportEqualsDeclaration;
exports.isTSImportType = isTSImportType;
exports.isTSIndexSignature = isTSIndexSignature;
exports.isTSIndexedAccessType = isTSIndexedAccessType;
exports.isTSInferType = isTSInferType;
exports.isTSInstantiationExpression = isTSInstantiationExpression;
exports.isTSInterfaceBody = isTSInterfaceBody;
exports.isTSInterfaceDeclaration = isTSInterfaceDeclaration;
exports.isTSIntersectionType = isTSIntersectionType;
exports.isTSIntrinsicKeyword = isTSIntrinsicKeyword;
exports.isTSLiteralType = isTSLiteralType;
exports.isTSMappedType = isTSMappedType;
exports.isTSMethodSignature = isTSMethodSignature;
exports.isTSModuleBlock = isTSModuleBlock;
exports.isTSModuleDeclaration = isTSModuleDeclaration;
exports.isTSNamedTupleMember = isTSNamedTupleMember;
exports.isTSNamespaceExportDeclaration = isTSNamespaceExportDeclaration;
exports.isTSNeverKeyword = isTSNeverKeyword;
exports.isTSNonNullExpression = isTSNonNullExpression;
exports.isTSNullKeyword = isTSNullKeyword;
exports.isTSNumberKeyword = isTSNumberKeyword;
exports.isTSObjectKeyword = isTSObjectKeyword;
exports.isTSOptionalType = isTSOptionalType;
exports.isTSParameterProperty = isTSParameterProperty;
exports.isTSParenthesizedType = isTSParenthesizedType;
exports.isTSPropertySignature = isTSPropertySignature;
exports.isTSQualifiedName = isTSQualifiedName;
exports.isTSRestType = isTSRestType;
exports.isTSSatisfiesExpression = isTSSatisfiesExpression;
exports.isTSStringKeyword = isTSStringKeyword;
exports.isTSSymbolKeyword = isTSSymbolKeyword;
exports.isTSThisType = isTSThisType;
exports.isTSTupleType = isTSTupleType;
exports.isTSType = isTSType;
exports.isTSTypeAliasDeclaration = isTSTypeAliasDeclaration;
exports.isTSTypeAnnotation = isTSTypeAnnotation;
exports.isTSTypeAssertion = isTSTypeAssertion;
exports.isTSTypeElement = isTSTypeElement;
exports.isTSTypeLiteral = isTSTypeLiteral;
exports.isTSTypeOperator = isTSTypeOperator;
exports.isTSTypeParameter = isTSTypeParameter;
exports.isTSTypeParameterDeclaration = isTSTypeParameterDeclaration;
exports.isTSTypeParameterInstantiation = isTSTypeParameterInstantiation;
exports.isTSTypePredicate = isTSTypePredicate;
exports.isTSTypeQuery = isTSTypeQuery;
exports.isTSTypeReference = isTSTypeReference;
exports.isTSUndefinedKeyword = isTSUndefinedKeyword;
exports.isTSUnionType = isTSUnionType;
exports.isTSUnknownKeyword = isTSUnknownKeyword;
exports.isTSVoidKeyword = isTSVoidKeyword;
exports.isTaggedTemplateExpression = isTaggedTemplateExpression;
exports.isTemplateElement = isTemplateElement;
exports.isTemplateLiteral = isTemplateLiteral;
exports.isTerminatorless = isTerminatorless;
exports.isThisExpression = isThisExpression;
exports.isThisTypeAnnotation = isThisTypeAnnotation;
exports.isThrowStatement = isThrowStatement;
exports.isTopicReference = isTopicReference;
exports.isTryStatement = isTryStatement;
exports.isTupleExpression = isTupleExpression;
exports.isTupleTypeAnnotation = isTupleTypeAnnotation;
exports.isTypeAlias = isTypeAlias;
exports.isTypeAnnotation = isTypeAnnotation;
exports.isTypeCastExpression = isTypeCastExpression;
exports.isTypeParameter = isTypeParameter;
exports.isTypeParameterDeclaration = isTypeParameterDeclaration;
exports.isTypeParameterInstantiation = isTypeParameterInstantiation;
exports.isTypeScript = isTypeScript;
exports.isTypeofTypeAnnotation = isTypeofTypeAnnotation;
exports.isUnaryExpression = isUnaryExpression;
exports.isUnaryLike = isUnaryLike;
exports.isUnionTypeAnnotation = isUnionTypeAnnotation;
exports.isUpdateExpression = isUpdateExpression;
exports.isUserWhitespacable = isUserWhitespacable;
exports.isV8IntrinsicIdentifier = isV8IntrinsicIdentifier;
exports.isVariableDeclaration = isVariableDeclaration;
exports.isVariableDeclarator = isVariableDeclarator;
exports.isVariance = isVariance;
exports.isVoidTypeAnnotation = isVoidTypeAnnotation;
exports.isWhile = isWhile;
exports.isWhileStatement = isWhileStatement;
exports.isWithStatement = isWithStatement;
exports.isYieldExpression = isYieldExpression;


function isArrayExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "ArrayExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isAssignmentExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "AssignmentExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isBinaryExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "BinaryExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isInterpreterDirective(node, opts) {
  if (!node) return false;
  if (node.type !== "InterpreterDirective") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDirective(node, opts) {
  if (!node) return false;
  if (node.type !== "Directive") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDirectiveLiteral(node, opts) {
  if (!node) return false;
  if (node.type !== "DirectiveLiteral") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isBlockStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "BlockStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isBreakStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "BreakStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isCallExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "CallExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isCatchClause(node, opts) {
  if (!node) return false;
  if (node.type !== "CatchClause") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isConditionalExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "ConditionalExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isContinueStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "ContinueStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDebuggerStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "DebuggerStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDoWhileStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "DoWhileStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isEmptyStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "EmptyStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isExpressionStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "ExpressionStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isFile(node, opts) {
  if (!node) return false;
  if (node.type !== "File") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isForInStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "ForInStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isForStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "ForStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isFunctionDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "FunctionDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isFunctionExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "FunctionExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isIdentifier(node, opts) {
  if (!node) return false;
  if (node.type !== "Identifier") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isIfStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "IfStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isLabeledStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "LabeledStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isStringLiteral(node, opts) {
  if (!node) return false;
  if (node.type !== "StringLiteral") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isNumericLiteral(node, opts) {
  if (!node) return false;
  if (node.type !== "NumericLiteral") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isNullLiteral(node, opts) {
  if (!node) return false;
  if (node.type !== "NullLiteral") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isBooleanLiteral(node, opts) {
  if (!node) return false;
  if (node.type !== "BooleanLiteral") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isRegExpLiteral(node, opts) {
  if (!node) return false;
  if (node.type !== "RegExpLiteral") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isLogicalExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "LogicalExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isMemberExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "MemberExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isNewExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "NewExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isProgram(node, opts) {
  if (!node) return false;
  if (node.type !== "Program") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isObjectExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "ObjectExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isObjectMethod(node, opts) {
  if (!node) return false;
  if (node.type !== "ObjectMethod") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isObjectProperty(node, opts) {
  if (!node) return false;
  if (node.type !== "ObjectProperty") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isRestElement(node, opts) {
  if (!node) return false;
  if (node.type !== "RestElement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isReturnStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "ReturnStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isSequenceExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "SequenceExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isParenthesizedExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "ParenthesizedExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isSwitchCase(node, opts) {
  if (!node) return false;
  if (node.type !== "SwitchCase") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isSwitchStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "SwitchStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isThisExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "ThisExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isThrowStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "ThrowStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTryStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "TryStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isUnaryExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "UnaryExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isUpdateExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "UpdateExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isVariableDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "VariableDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isVariableDeclarator(node, opts) {
  if (!node) return false;
  if (node.type !== "VariableDeclarator") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isWhileStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "WhileStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isWithStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "WithStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isAssignmentPattern(node, opts) {
  if (!node) return false;
  if (node.type !== "AssignmentPattern") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isArrayPattern(node, opts) {
  if (!node) return false;
  if (node.type !== "ArrayPattern") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isArrowFunctionExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "ArrowFunctionExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isClassBody(node, opts) {
  if (!node) return false;
  if (node.type !== "ClassBody") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isClassExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "ClassExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isClassDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "ClassDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isExportAllDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "ExportAllDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isExportDefaultDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "ExportDefaultDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isExportNamedDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "ExportNamedDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isExportSpecifier(node, opts) {
  if (!node) return false;
  if (node.type !== "ExportSpecifier") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isForOfStatement(node, opts) {
  if (!node) return false;
  if (node.type !== "ForOfStatement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isImportDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "ImportDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isImportDefaultSpecifier(node, opts) {
  if (!node) return false;
  if (node.type !== "ImportDefaultSpecifier") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isImportNamespaceSpecifier(node, opts) {
  if (!node) return false;
  if (node.type !== "ImportNamespaceSpecifier") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isImportSpecifier(node, opts) {
  if (!node) return false;
  if (node.type !== "ImportSpecifier") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isImportExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "ImportExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isMetaProperty(node, opts) {
  if (!node) return false;
  if (node.type !== "MetaProperty") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isClassMethod(node, opts) {
  if (!node) return false;
  if (node.type !== "ClassMethod") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isObjectPattern(node, opts) {
  if (!node) return false;
  if (node.type !== "ObjectPattern") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isSpreadElement(node, opts) {
  if (!node) return false;
  if (node.type !== "SpreadElement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isSuper(node, opts) {
  if (!node) return false;
  if (node.type !== "Super") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTaggedTemplateExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "TaggedTemplateExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTemplateElement(node, opts) {
  if (!node) return false;
  if (node.type !== "TemplateElement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTemplateLiteral(node, opts) {
  if (!node) return false;
  if (node.type !== "TemplateLiteral") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isYieldExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "YieldExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isAwaitExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "AwaitExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isImport(node, opts) {
  if (!node) return false;
  if (node.type !== "Import") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isBigIntLiteral(node, opts) {
  if (!node) return false;
  if (node.type !== "BigIntLiteral") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isExportNamespaceSpecifier(node, opts) {
  if (!node) return false;
  if (node.type !== "ExportNamespaceSpecifier") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isOptionalMemberExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "OptionalMemberExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isOptionalCallExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "OptionalCallExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isClassProperty(node, opts) {
  if (!node) return false;
  if (node.type !== "ClassProperty") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isClassAccessorProperty(node, opts) {
  if (!node) return false;
  if (node.type !== "ClassAccessorProperty") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isClassPrivateProperty(node, opts) {
  if (!node) return false;
  if (node.type !== "ClassPrivateProperty") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isClassPrivateMethod(node, opts) {
  if (!node) return false;
  if (node.type !== "ClassPrivateMethod") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isPrivateName(node, opts) {
  if (!node) return false;
  if (node.type !== "PrivateName") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isStaticBlock(node, opts) {
  if (!node) return false;
  if (node.type !== "StaticBlock") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isAnyTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "AnyTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isArrayTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "ArrayTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isBooleanTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "BooleanTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isBooleanLiteralTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "BooleanLiteralTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isNullLiteralTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "NullLiteralTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isClassImplements(node, opts) {
  if (!node) return false;
  if (node.type !== "ClassImplements") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDeclareClass(node, opts) {
  if (!node) return false;
  if (node.type !== "DeclareClass") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDeclareFunction(node, opts) {
  if (!node) return false;
  if (node.type !== "DeclareFunction") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDeclareInterface(node, opts) {
  if (!node) return false;
  if (node.type !== "DeclareInterface") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDeclareModule(node, opts) {
  if (!node) return false;
  if (node.type !== "DeclareModule") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDeclareModuleExports(node, opts) {
  if (!node) return false;
  if (node.type !== "DeclareModuleExports") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDeclareTypeAlias(node, opts) {
  if (!node) return false;
  if (node.type !== "DeclareTypeAlias") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDeclareOpaqueType(node, opts) {
  if (!node) return false;
  if (node.type !== "DeclareOpaqueType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDeclareVariable(node, opts) {
  if (!node) return false;
  if (node.type !== "DeclareVariable") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDeclareExportDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "DeclareExportDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDeclareExportAllDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "DeclareExportAllDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDeclaredPredicate(node, opts) {
  if (!node) return false;
  if (node.type !== "DeclaredPredicate") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isExistsTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "ExistsTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isFunctionTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "FunctionTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isFunctionTypeParam(node, opts) {
  if (!node) return false;
  if (node.type !== "FunctionTypeParam") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isGenericTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "GenericTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isInferredPredicate(node, opts) {
  if (!node) return false;
  if (node.type !== "InferredPredicate") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isInterfaceExtends(node, opts) {
  if (!node) return false;
  if (node.type !== "InterfaceExtends") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isInterfaceDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "InterfaceDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isInterfaceTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "InterfaceTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isIntersectionTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "IntersectionTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isMixedTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "MixedTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isEmptyTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "EmptyTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isNullableTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "NullableTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isNumberLiteralTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "NumberLiteralTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isNumberTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "NumberTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isObjectTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "ObjectTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isObjectTypeInternalSlot(node, opts) {
  if (!node) return false;
  if (node.type !== "ObjectTypeInternalSlot") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isObjectTypeCallProperty(node, opts) {
  if (!node) return false;
  if (node.type !== "ObjectTypeCallProperty") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isObjectTypeIndexer(node, opts) {
  if (!node) return false;
  if (node.type !== "ObjectTypeIndexer") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isObjectTypeProperty(node, opts) {
  if (!node) return false;
  if (node.type !== "ObjectTypeProperty") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isObjectTypeSpreadProperty(node, opts) {
  if (!node) return false;
  if (node.type !== "ObjectTypeSpreadProperty") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isOpaqueType(node, opts) {
  if (!node) return false;
  if (node.type !== "OpaqueType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isQualifiedTypeIdentifier(node, opts) {
  if (!node) return false;
  if (node.type !== "QualifiedTypeIdentifier") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isStringLiteralTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "StringLiteralTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isStringTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "StringTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isSymbolTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "SymbolTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isThisTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "ThisTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTupleTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "TupleTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTypeofTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "TypeofTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTypeAlias(node, opts) {
  if (!node) return false;
  if (node.type !== "TypeAlias") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "TypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTypeCastExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "TypeCastExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTypeParameter(node, opts) {
  if (!node) return false;
  if (node.type !== "TypeParameter") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTypeParameterDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "TypeParameterDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTypeParameterInstantiation(node, opts) {
  if (!node) return false;
  if (node.type !== "TypeParameterInstantiation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isUnionTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "UnionTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isVariance(node, opts) {
  if (!node) return false;
  if (node.type !== "Variance") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isVoidTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "VoidTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isEnumDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "EnumDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isEnumBooleanBody(node, opts) {
  if (!node) return false;
  if (node.type !== "EnumBooleanBody") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isEnumNumberBody(node, opts) {
  if (!node) return false;
  if (node.type !== "EnumNumberBody") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isEnumStringBody(node, opts) {
  if (!node) return false;
  if (node.type !== "EnumStringBody") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isEnumSymbolBody(node, opts) {
  if (!node) return false;
  if (node.type !== "EnumSymbolBody") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isEnumBooleanMember(node, opts) {
  if (!node) return false;
  if (node.type !== "EnumBooleanMember") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isEnumNumberMember(node, opts) {
  if (!node) return false;
  if (node.type !== "EnumNumberMember") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isEnumStringMember(node, opts) {
  if (!node) return false;
  if (node.type !== "EnumStringMember") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isEnumDefaultedMember(node, opts) {
  if (!node) return false;
  if (node.type !== "EnumDefaultedMember") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isIndexedAccessType(node, opts) {
  if (!node) return false;
  if (node.type !== "IndexedAccessType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isOptionalIndexedAccessType(node, opts) {
  if (!node) return false;
  if (node.type !== "OptionalIndexedAccessType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXAttribute(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXAttribute") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXClosingElement(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXClosingElement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXElement(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXElement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXEmptyExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXEmptyExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXExpressionContainer(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXExpressionContainer") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXSpreadChild(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXSpreadChild") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXIdentifier(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXIdentifier") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXMemberExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXMemberExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXNamespacedName(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXNamespacedName") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXOpeningElement(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXOpeningElement") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXSpreadAttribute(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXSpreadAttribute") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXText(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXText") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXFragment(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXFragment") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXOpeningFragment(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXOpeningFragment") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSXClosingFragment(node, opts) {
  if (!node) return false;
  if (node.type !== "JSXClosingFragment") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isNoop(node, opts) {
  if (!node) return false;
  if (node.type !== "Noop") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isPlaceholder(node, opts) {
  if (!node) return false;
  if (node.type !== "Placeholder") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isV8IntrinsicIdentifier(node, opts) {
  if (!node) return false;
  if (node.type !== "V8IntrinsicIdentifier") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isArgumentPlaceholder(node, opts) {
  if (!node) return false;
  if (node.type !== "ArgumentPlaceholder") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isBindExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "BindExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isImportAttribute(node, opts) {
  if (!node) return false;
  if (node.type !== "ImportAttribute") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDecorator(node, opts) {
  if (!node) return false;
  if (node.type !== "Decorator") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDoExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "DoExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isExportDefaultSpecifier(node, opts) {
  if (!node) return false;
  if (node.type !== "ExportDefaultSpecifier") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isRecordExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "RecordExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTupleExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "TupleExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDecimalLiteral(node, opts) {
  if (!node) return false;
  if (node.type !== "DecimalLiteral") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isModuleExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "ModuleExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTopicReference(node, opts) {
  if (!node) return false;
  if (node.type !== "TopicReference") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isPipelineTopicExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "PipelineTopicExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isPipelineBareFunction(node, opts) {
  if (!node) return false;
  if (node.type !== "PipelineBareFunction") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isPipelinePrimaryTopicReference(node, opts) {
  if (!node) return false;
  if (node.type !== "PipelinePrimaryTopicReference") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSParameterProperty(node, opts) {
  if (!node) return false;
  if (node.type !== "TSParameterProperty") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSDeclareFunction(node, opts) {
  if (!node) return false;
  if (node.type !== "TSDeclareFunction") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSDeclareMethod(node, opts) {
  if (!node) return false;
  if (node.type !== "TSDeclareMethod") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSQualifiedName(node, opts) {
  if (!node) return false;
  if (node.type !== "TSQualifiedName") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSCallSignatureDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "TSCallSignatureDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSConstructSignatureDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "TSConstructSignatureDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSPropertySignature(node, opts) {
  if (!node) return false;
  if (node.type !== "TSPropertySignature") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSMethodSignature(node, opts) {
  if (!node) return false;
  if (node.type !== "TSMethodSignature") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSIndexSignature(node, opts) {
  if (!node) return false;
  if (node.type !== "TSIndexSignature") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSAnyKeyword(node, opts) {
  if (!node) return false;
  if (node.type !== "TSAnyKeyword") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSBooleanKeyword(node, opts) {
  if (!node) return false;
  if (node.type !== "TSBooleanKeyword") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSBigIntKeyword(node, opts) {
  if (!node) return false;
  if (node.type !== "TSBigIntKeyword") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSIntrinsicKeyword(node, opts) {
  if (!node) return false;
  if (node.type !== "TSIntrinsicKeyword") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSNeverKeyword(node, opts) {
  if (!node) return false;
  if (node.type !== "TSNeverKeyword") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSNullKeyword(node, opts) {
  if (!node) return false;
  if (node.type !== "TSNullKeyword") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSNumberKeyword(node, opts) {
  if (!node) return false;
  if (node.type !== "TSNumberKeyword") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSObjectKeyword(node, opts) {
  if (!node) return false;
  if (node.type !== "TSObjectKeyword") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSStringKeyword(node, opts) {
  if (!node) return false;
  if (node.type !== "TSStringKeyword") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSSymbolKeyword(node, opts) {
  if (!node) return false;
  if (node.type !== "TSSymbolKeyword") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSUndefinedKeyword(node, opts) {
  if (!node) return false;
  if (node.type !== "TSUndefinedKeyword") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSUnknownKeyword(node, opts) {
  if (!node) return false;
  if (node.type !== "TSUnknownKeyword") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSVoidKeyword(node, opts) {
  if (!node) return false;
  if (node.type !== "TSVoidKeyword") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSThisType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSThisType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSFunctionType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSFunctionType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSConstructorType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSConstructorType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSTypeReference(node, opts) {
  if (!node) return false;
  if (node.type !== "TSTypeReference") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSTypePredicate(node, opts) {
  if (!node) return false;
  if (node.type !== "TSTypePredicate") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSTypeQuery(node, opts) {
  if (!node) return false;
  if (node.type !== "TSTypeQuery") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSTypeLiteral(node, opts) {
  if (!node) return false;
  if (node.type !== "TSTypeLiteral") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSArrayType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSArrayType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSTupleType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSTupleType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSOptionalType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSOptionalType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSRestType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSRestType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSNamedTupleMember(node, opts) {
  if (!node) return false;
  if (node.type !== "TSNamedTupleMember") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSUnionType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSUnionType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSIntersectionType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSIntersectionType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSConditionalType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSConditionalType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSInferType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSInferType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSParenthesizedType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSParenthesizedType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSTypeOperator(node, opts) {
  if (!node) return false;
  if (node.type !== "TSTypeOperator") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSIndexedAccessType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSIndexedAccessType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSMappedType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSMappedType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSLiteralType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSLiteralType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSExpressionWithTypeArguments(node, opts) {
  if (!node) return false;
  if (node.type !== "TSExpressionWithTypeArguments") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSInterfaceDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "TSInterfaceDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSInterfaceBody(node, opts) {
  if (!node) return false;
  if (node.type !== "TSInterfaceBody") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSTypeAliasDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "TSTypeAliasDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSInstantiationExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "TSInstantiationExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSAsExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "TSAsExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSSatisfiesExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "TSSatisfiesExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSTypeAssertion(node, opts) {
  if (!node) return false;
  if (node.type !== "TSTypeAssertion") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSEnumDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "TSEnumDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSEnumMember(node, opts) {
  if (!node) return false;
  if (node.type !== "TSEnumMember") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSModuleDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "TSModuleDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSModuleBlock(node, opts) {
  if (!node) return false;
  if (node.type !== "TSModuleBlock") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSImportType(node, opts) {
  if (!node) return false;
  if (node.type !== "TSImportType") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSImportEqualsDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "TSImportEqualsDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSExternalModuleReference(node, opts) {
  if (!node) return false;
  if (node.type !== "TSExternalModuleReference") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSNonNullExpression(node, opts) {
  if (!node) return false;
  if (node.type !== "TSNonNullExpression") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSExportAssignment(node, opts) {
  if (!node) return false;
  if (node.type !== "TSExportAssignment") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSNamespaceExportDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "TSNamespaceExportDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSTypeAnnotation(node, opts) {
  if (!node) return false;
  if (node.type !== "TSTypeAnnotation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSTypeParameterInstantiation(node, opts) {
  if (!node) return false;
  if (node.type !== "TSTypeParameterInstantiation") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSTypeParameterDeclaration(node, opts) {
  if (!node) return false;
  if (node.type !== "TSTypeParameterDeclaration") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSTypeParameter(node, opts) {
  if (!node) return false;
  if (node.type !== "TSTypeParameter") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isStandardized(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ArrayExpression":
    case "AssignmentExpression":
    case "BinaryExpression":
    case "InterpreterDirective":
    case "Directive":
    case "DirectiveLiteral":
    case "BlockStatement":
    case "BreakStatement":
    case "CallExpression":
    case "CatchClause":
    case "ConditionalExpression":
    case "ContinueStatement":
    case "DebuggerStatement":
    case "DoWhileStatement":
    case "EmptyStatement":
    case "ExpressionStatement":
    case "File":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "Identifier":
    case "IfStatement":
    case "LabeledStatement":
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "LogicalExpression":
    case "MemberExpression":
    case "NewExpression":
    case "Program":
    case "ObjectExpression":
    case "ObjectMethod":
    case "ObjectProperty":
    case "RestElement":
    case "ReturnStatement":
    case "SequenceExpression":
    case "ParenthesizedExpression":
    case "SwitchCase":
    case "SwitchStatement":
    case "ThisExpression":
    case "ThrowStatement":
    case "TryStatement":
    case "UnaryExpression":
    case "UpdateExpression":
    case "VariableDeclaration":
    case "VariableDeclarator":
    case "WhileStatement":
    case "WithStatement":
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ArrowFunctionExpression":
    case "ClassBody":
    case "ClassExpression":
    case "ClassDeclaration":
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ExportSpecifier":
    case "ForOfStatement":
    case "ImportDeclaration":
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
    case "ImportExpression":
    case "MetaProperty":
    case "ClassMethod":
    case "ObjectPattern":
    case "SpreadElement":
    case "Super":
    case "TaggedTemplateExpression":
    case "TemplateElement":
    case "TemplateLiteral":
    case "YieldExpression":
    case "AwaitExpression":
    case "Import":
    case "BigIntLiteral":
    case "ExportNamespaceSpecifier":
    case "OptionalMemberExpression":
    case "OptionalCallExpression":
    case "ClassProperty":
    case "ClassAccessorProperty":
    case "ClassPrivateProperty":
    case "ClassPrivateMethod":
    case "PrivateName":
    case "StaticBlock":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Identifier":
        case "StringLiteral":
        case "BlockStatement":
        case "ClassBody":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isExpression(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ArrayExpression":
    case "AssignmentExpression":
    case "BinaryExpression":
    case "CallExpression":
    case "ConditionalExpression":
    case "FunctionExpression":
    case "Identifier":
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "LogicalExpression":
    case "MemberExpression":
    case "NewExpression":
    case "ObjectExpression":
    case "SequenceExpression":
    case "ParenthesizedExpression":
    case "ThisExpression":
    case "UnaryExpression":
    case "UpdateExpression":
    case "ArrowFunctionExpression":
    case "ClassExpression":
    case "ImportExpression":
    case "MetaProperty":
    case "Super":
    case "TaggedTemplateExpression":
    case "TemplateLiteral":
    case "YieldExpression":
    case "AwaitExpression":
    case "Import":
    case "BigIntLiteral":
    case "OptionalMemberExpression":
    case "OptionalCallExpression":
    case "TypeCastExpression":
    case "JSXElement":
    case "JSXFragment":
    case "BindExpression":
    case "DoExpression":
    case "RecordExpression":
    case "TupleExpression":
    case "DecimalLiteral":
    case "ModuleExpression":
    case "TopicReference":
    case "PipelineTopicExpression":
    case "PipelineBareFunction":
    case "PipelinePrimaryTopicReference":
    case "TSInstantiationExpression":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Expression":
        case "Identifier":
        case "StringLiteral":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isBinary(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BinaryExpression":
    case "LogicalExpression":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isScopable(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BlockStatement":
    case "CatchClause":
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "Program":
    case "ObjectMethod":
    case "SwitchStatement":
    case "WhileStatement":
    case "ArrowFunctionExpression":
    case "ClassExpression":
    case "ClassDeclaration":
    case "ForOfStatement":
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "StaticBlock":
    case "TSModuleBlock":
      break;
    case "Placeholder":
      if (node.expectedNode === "BlockStatement") break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isBlockParent(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BlockStatement":
    case "CatchClause":
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "Program":
    case "ObjectMethod":
    case "SwitchStatement":
    case "WhileStatement":
    case "ArrowFunctionExpression":
    case "ForOfStatement":
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "StaticBlock":
    case "TSModuleBlock":
      break;
    case "Placeholder":
      if (node.expectedNode === "BlockStatement") break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isBlock(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BlockStatement":
    case "Program":
    case "TSModuleBlock":
      break;
    case "Placeholder":
      if (node.expectedNode === "BlockStatement") break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isStatement(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BlockStatement":
    case "BreakStatement":
    case "ContinueStatement":
    case "DebuggerStatement":
    case "DoWhileStatement":
    case "EmptyStatement":
    case "ExpressionStatement":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "IfStatement":
    case "LabeledStatement":
    case "ReturnStatement":
    case "SwitchStatement":
    case "ThrowStatement":
    case "TryStatement":
    case "VariableDeclaration":
    case "WhileStatement":
    case "WithStatement":
    case "ClassDeclaration":
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ForOfStatement":
    case "ImportDeclaration":
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "InterfaceDeclaration":
    case "OpaqueType":
    case "TypeAlias":
    case "EnumDeclaration":
    case "TSDeclareFunction":
    case "TSInterfaceDeclaration":
    case "TSTypeAliasDeclaration":
    case "TSEnumDeclaration":
    case "TSModuleDeclaration":
    case "TSImportEqualsDeclaration":
    case "TSExportAssignment":
    case "TSNamespaceExportDeclaration":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Statement":
        case "Declaration":
        case "BlockStatement":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTerminatorless(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BreakStatement":
    case "ContinueStatement":
    case "ReturnStatement":
    case "ThrowStatement":
    case "YieldExpression":
    case "AwaitExpression":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isCompletionStatement(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BreakStatement":
    case "ContinueStatement":
    case "ReturnStatement":
    case "ThrowStatement":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isConditional(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ConditionalExpression":
    case "IfStatement":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isLoop(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForStatement":
    case "WhileStatement":
    case "ForOfStatement":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isWhile(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "DoWhileStatement":
    case "WhileStatement":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isExpressionWrapper(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ExpressionStatement":
    case "ParenthesizedExpression":
    case "TypeCastExpression":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isFor(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ForInStatement":
    case "ForStatement":
    case "ForOfStatement":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isForXStatement(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ForInStatement":
    case "ForOfStatement":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isFunction(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "ObjectMethod":
    case "ArrowFunctionExpression":
    case "ClassMethod":
    case "ClassPrivateMethod":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isFunctionParent(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "ObjectMethod":
    case "ArrowFunctionExpression":
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "StaticBlock":
    case "TSModuleBlock":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isPureish(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "ArrowFunctionExpression":
    case "BigIntLiteral":
    case "DecimalLiteral":
      break;
    case "Placeholder":
      if (node.expectedNode === "StringLiteral") break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isDeclaration(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "FunctionDeclaration":
    case "VariableDeclaration":
    case "ClassDeclaration":
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ImportDeclaration":
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "InterfaceDeclaration":
    case "OpaqueType":
    case "TypeAlias":
    case "EnumDeclaration":
    case "TSDeclareFunction":
    case "TSInterfaceDeclaration":
    case "TSTypeAliasDeclaration":
    case "TSEnumDeclaration":
    case "TSModuleDeclaration":
      break;
    case "Placeholder":
      if (node.expectedNode === "Declaration") break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isPatternLike(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "Identifier":
    case "RestElement":
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ObjectPattern":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Pattern":
        case "Identifier":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isLVal(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "Identifier":
    case "MemberExpression":
    case "RestElement":
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ObjectPattern":
    case "TSParameterProperty":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Pattern":
        case "Identifier":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSEntityName(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "Identifier":
    case "TSQualifiedName":
      break;
    case "Placeholder":
      if (node.expectedNode === "Identifier") break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isLiteral(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "TemplateLiteral":
    case "BigIntLiteral":
    case "DecimalLiteral":
      break;
    case "Placeholder":
      if (node.expectedNode === "StringLiteral") break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isImmutable(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "BigIntLiteral":
    case "JSXAttribute":
    case "JSXClosingElement":
    case "JSXElement":
    case "JSXExpressionContainer":
    case "JSXSpreadChild":
    case "JSXOpeningElement":
    case "JSXText":
    case "JSXFragment":
    case "JSXOpeningFragment":
    case "JSXClosingFragment":
    case "DecimalLiteral":
      break;
    case "Placeholder":
      if (node.expectedNode === "StringLiteral") break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isUserWhitespacable(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ObjectMethod":
    case "ObjectProperty":
    case "ObjectTypeInternalSlot":
    case "ObjectTypeCallProperty":
    case "ObjectTypeIndexer":
    case "ObjectTypeProperty":
    case "ObjectTypeSpreadProperty":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isMethod(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ObjectMethod":
    case "ClassMethod":
    case "ClassPrivateMethod":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isObjectMember(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ObjectMethod":
    case "ObjectProperty":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isProperty(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ObjectProperty":
    case "ClassProperty":
    case "ClassAccessorProperty":
    case "ClassPrivateProperty":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isUnaryLike(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "UnaryExpression":
    case "SpreadElement":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isPattern(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ObjectPattern":
      break;
    case "Placeholder":
      if (node.expectedNode === "Pattern") break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isClass(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ClassExpression":
    case "ClassDeclaration":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isImportOrExportDeclaration(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ImportDeclaration":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isExportDeclaration(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isModuleSpecifier(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ExportSpecifier":
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
    case "ExportNamespaceSpecifier":
    case "ExportDefaultSpecifier":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isAccessor(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ClassAccessorProperty":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isPrivate(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ClassPrivateProperty":
    case "ClassPrivateMethod":
    case "PrivateName":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isFlow(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "AnyTypeAnnotation":
    case "ArrayTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "BooleanLiteralTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "ClassImplements":
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "DeclaredPredicate":
    case "ExistsTypeAnnotation":
    case "FunctionTypeAnnotation":
    case "FunctionTypeParam":
    case "GenericTypeAnnotation":
    case "InferredPredicate":
    case "InterfaceExtends":
    case "InterfaceDeclaration":
    case "InterfaceTypeAnnotation":
    case "IntersectionTypeAnnotation":
    case "MixedTypeAnnotation":
    case "EmptyTypeAnnotation":
    case "NullableTypeAnnotation":
    case "NumberLiteralTypeAnnotation":
    case "NumberTypeAnnotation":
    case "ObjectTypeAnnotation":
    case "ObjectTypeInternalSlot":
    case "ObjectTypeCallProperty":
    case "ObjectTypeIndexer":
    case "ObjectTypeProperty":
    case "ObjectTypeSpreadProperty":
    case "OpaqueType":
    case "QualifiedTypeIdentifier":
    case "StringLiteralTypeAnnotation":
    case "StringTypeAnnotation":
    case "SymbolTypeAnnotation":
    case "ThisTypeAnnotation":
    case "TupleTypeAnnotation":
    case "TypeofTypeAnnotation":
    case "TypeAlias":
    case "TypeAnnotation":
    case "TypeCastExpression":
    case "TypeParameter":
    case "TypeParameterDeclaration":
    case "TypeParameterInstantiation":
    case "UnionTypeAnnotation":
    case "Variance":
    case "VoidTypeAnnotation":
    case "EnumDeclaration":
    case "EnumBooleanBody":
    case "EnumNumberBody":
    case "EnumStringBody":
    case "EnumSymbolBody":
    case "EnumBooleanMember":
    case "EnumNumberMember":
    case "EnumStringMember":
    case "EnumDefaultedMember":
    case "IndexedAccessType":
    case "OptionalIndexedAccessType":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isFlowType(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "AnyTypeAnnotation":
    case "ArrayTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "BooleanLiteralTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "ExistsTypeAnnotation":
    case "FunctionTypeAnnotation":
    case "GenericTypeAnnotation":
    case "InterfaceTypeAnnotation":
    case "IntersectionTypeAnnotation":
    case "MixedTypeAnnotation":
    case "EmptyTypeAnnotation":
    case "NullableTypeAnnotation":
    case "NumberLiteralTypeAnnotation":
    case "NumberTypeAnnotation":
    case "ObjectTypeAnnotation":
    case "StringLiteralTypeAnnotation":
    case "StringTypeAnnotation":
    case "SymbolTypeAnnotation":
    case "ThisTypeAnnotation":
    case "TupleTypeAnnotation":
    case "TypeofTypeAnnotation":
    case "UnionTypeAnnotation":
    case "VoidTypeAnnotation":
    case "IndexedAccessType":
    case "OptionalIndexedAccessType":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isFlowBaseAnnotation(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "AnyTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "MixedTypeAnnotation":
    case "EmptyTypeAnnotation":
    case "NumberTypeAnnotation":
    case "StringTypeAnnotation":
    case "SymbolTypeAnnotation":
    case "ThisTypeAnnotation":
    case "VoidTypeAnnotation":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isFlowDeclaration(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "InterfaceDeclaration":
    case "OpaqueType":
    case "TypeAlias":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isFlowPredicate(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "DeclaredPredicate":
    case "InferredPredicate":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isEnumBody(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "EnumBooleanBody":
    case "EnumNumberBody":
    case "EnumStringBody":
    case "EnumSymbolBody":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isEnumMember(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "EnumBooleanMember":
    case "EnumNumberMember":
    case "EnumStringMember":
    case "EnumDefaultedMember":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isJSX(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "JSXAttribute":
    case "JSXClosingElement":
    case "JSXElement":
    case "JSXEmptyExpression":
    case "JSXExpressionContainer":
    case "JSXSpreadChild":
    case "JSXIdentifier":
    case "JSXMemberExpression":
    case "JSXNamespacedName":
    case "JSXOpeningElement":
    case "JSXSpreadAttribute":
    case "JSXText":
    case "JSXFragment":
    case "JSXOpeningFragment":
    case "JSXClosingFragment":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isMiscellaneous(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "Noop":
    case "Placeholder":
    case "V8IntrinsicIdentifier":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTypeScript(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "TSParameterProperty":
    case "TSDeclareFunction":
    case "TSDeclareMethod":
    case "TSQualifiedName":
    case "TSCallSignatureDeclaration":
    case "TSConstructSignatureDeclaration":
    case "TSPropertySignature":
    case "TSMethodSignature":
    case "TSIndexSignature":
    case "TSAnyKeyword":
    case "TSBooleanKeyword":
    case "TSBigIntKeyword":
    case "TSIntrinsicKeyword":
    case "TSNeverKeyword":
    case "TSNullKeyword":
    case "TSNumberKeyword":
    case "TSObjectKeyword":
    case "TSStringKeyword":
    case "TSSymbolKeyword":
    case "TSUndefinedKeyword":
    case "TSUnknownKeyword":
    case "TSVoidKeyword":
    case "TSThisType":
    case "TSFunctionType":
    case "TSConstructorType":
    case "TSTypeReference":
    case "TSTypePredicate":
    case "TSTypeQuery":
    case "TSTypeLiteral":
    case "TSArrayType":
    case "TSTupleType":
    case "TSOptionalType":
    case "TSRestType":
    case "TSNamedTupleMember":
    case "TSUnionType":
    case "TSIntersectionType":
    case "TSConditionalType":
    case "TSInferType":
    case "TSParenthesizedType":
    case "TSTypeOperator":
    case "TSIndexedAccessType":
    case "TSMappedType":
    case "TSLiteralType":
    case "TSExpressionWithTypeArguments":
    case "TSInterfaceDeclaration":
    case "TSInterfaceBody":
    case "TSTypeAliasDeclaration":
    case "TSInstantiationExpression":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSEnumDeclaration":
    case "TSEnumMember":
    case "TSModuleDeclaration":
    case "TSModuleBlock":
    case "TSImportType":
    case "TSImportEqualsDeclaration":
    case "TSExternalModuleReference":
    case "TSNonNullExpression":
    case "TSExportAssignment":
    case "TSNamespaceExportDeclaration":
    case "TSTypeAnnotation":
    case "TSTypeParameterInstantiation":
    case "TSTypeParameterDeclaration":
    case "TSTypeParameter":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSTypeElement(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "TSCallSignatureDeclaration":
    case "TSConstructSignatureDeclaration":
    case "TSPropertySignature":
    case "TSMethodSignature":
    case "TSIndexSignature":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSType(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "TSAnyKeyword":
    case "TSBooleanKeyword":
    case "TSBigIntKeyword":
    case "TSIntrinsicKeyword":
    case "TSNeverKeyword":
    case "TSNullKeyword":
    case "TSNumberKeyword":
    case "TSObjectKeyword":
    case "TSStringKeyword":
    case "TSSymbolKeyword":
    case "TSUndefinedKeyword":
    case "TSUnknownKeyword":
    case "TSVoidKeyword":
    case "TSThisType":
    case "TSFunctionType":
    case "TSConstructorType":
    case "TSTypeReference":
    case "TSTypePredicate":
    case "TSTypeQuery":
    case "TSTypeLiteral":
    case "TSArrayType":
    case "TSTupleType":
    case "TSOptionalType":
    case "TSRestType":
    case "TSUnionType":
    case "TSIntersectionType":
    case "TSConditionalType":
    case "TSInferType":
    case "TSParenthesizedType":
    case "TSTypeOperator":
    case "TSIndexedAccessType":
    case "TSMappedType":
    case "TSLiteralType":
    case "TSExpressionWithTypeArguments":
    case "TSImportType":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isTSBaseType(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "TSAnyKeyword":
    case "TSBooleanKeyword":
    case "TSBigIntKeyword":
    case "TSIntrinsicKeyword":
    case "TSNeverKeyword":
    case "TSNullKeyword":
    case "TSNumberKeyword":
    case "TSObjectKeyword":
    case "TSStringKeyword":
    case "TSSymbolKeyword":
    case "TSUndefinedKeyword":
    case "TSUnknownKeyword":
    case "TSVoidKeyword":
    case "TSThisType":
    case "TSLiteralType":
      break;
    default:
      return false;
  }
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isNumberLiteral(node, opts) {
  (0, deprecationWarning_1.default)("isNumberLiteral", "isNumericLiteral");
  if (!node) return false;
  if (node.type !== "NumberLiteral") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isRegexLiteral(node, opts) {
  (0, deprecationWarning_1.default)("isRegexLiteral", "isRegExpLiteral");
  if (!node) return false;
  if (node.type !== "RegexLiteral") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isRestProperty(node, opts) {
  (0, deprecationWarning_1.default)("isRestProperty", "isRestElement");
  if (!node) return false;
  if (node.type !== "RestProperty") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isSpreadProperty(node, opts) {
  (0, deprecationWarning_1.default)("isSpreadProperty", "isSpreadElement");
  if (!node) return false;
  if (node.type !== "SpreadProperty") return false;
  return opts == null || (0, shallowEqual_1.default)(node, opts);
}
function isModuleDeclaration(node, opts) {
  (0, deprecationWarning_1.default)("isModuleDeclaration", "isImportOrExportDeclaration");
  return isImportOrExportDeclaration(node, opts);
}


});

unwrapExports(generated$3);
generated$3.isAccessor;
generated$3.isAnyTypeAnnotation;
generated$3.isArgumentPlaceholder;
generated$3.isArrayExpression;
generated$3.isArrayPattern;
generated$3.isArrayTypeAnnotation;
generated$3.isArrowFunctionExpression;
generated$3.isAssignmentExpression;
generated$3.isAssignmentPattern;
generated$3.isAwaitExpression;
generated$3.isBigIntLiteral;
generated$3.isBinary;
generated$3.isBinaryExpression;
generated$3.isBindExpression;
generated$3.isBlock;
generated$3.isBlockParent;
generated$3.isBlockStatement;
generated$3.isBooleanLiteral;
generated$3.isBooleanLiteralTypeAnnotation;
generated$3.isBooleanTypeAnnotation;
generated$3.isBreakStatement;
generated$3.isCallExpression;
generated$3.isCatchClause;
generated$3.isClass;
generated$3.isClassAccessorProperty;
generated$3.isClassBody;
generated$3.isClassDeclaration;
generated$3.isClassExpression;
generated$3.isClassImplements;
generated$3.isClassMethod;
generated$3.isClassPrivateMethod;
generated$3.isClassPrivateProperty;
generated$3.isClassProperty;
generated$3.isCompletionStatement;
generated$3.isConditional;
generated$3.isConditionalExpression;
generated$3.isContinueStatement;
generated$3.isDebuggerStatement;
generated$3.isDecimalLiteral;
generated$3.isDeclaration;
generated$3.isDeclareClass;
generated$3.isDeclareExportAllDeclaration;
generated$3.isDeclareExportDeclaration;
generated$3.isDeclareFunction;
generated$3.isDeclareInterface;
generated$3.isDeclareModule;
generated$3.isDeclareModuleExports;
generated$3.isDeclareOpaqueType;
generated$3.isDeclareTypeAlias;
generated$3.isDeclareVariable;
generated$3.isDeclaredPredicate;
generated$3.isDecorator;
generated$3.isDirective;
generated$3.isDirectiveLiteral;
generated$3.isDoExpression;
generated$3.isDoWhileStatement;
generated$3.isEmptyStatement;
generated$3.isEmptyTypeAnnotation;
generated$3.isEnumBody;
generated$3.isEnumBooleanBody;
generated$3.isEnumBooleanMember;
generated$3.isEnumDeclaration;
generated$3.isEnumDefaultedMember;
generated$3.isEnumMember;
generated$3.isEnumNumberBody;
generated$3.isEnumNumberMember;
generated$3.isEnumStringBody;
generated$3.isEnumStringMember;
generated$3.isEnumSymbolBody;
generated$3.isExistsTypeAnnotation;
generated$3.isExportAllDeclaration;
generated$3.isExportDeclaration;
generated$3.isExportDefaultDeclaration;
generated$3.isExportDefaultSpecifier;
generated$3.isExportNamedDeclaration;
generated$3.isExportNamespaceSpecifier;
generated$3.isExportSpecifier;
generated$3.isExpression;
generated$3.isExpressionStatement;
generated$3.isExpressionWrapper;
generated$3.isFile;
generated$3.isFlow;
generated$3.isFlowBaseAnnotation;
generated$3.isFlowDeclaration;
generated$3.isFlowPredicate;
generated$3.isFlowType;
generated$3.isFor;
generated$3.isForInStatement;
generated$3.isForOfStatement;
generated$3.isForStatement;
generated$3.isForXStatement;
generated$3.isFunction;
generated$3.isFunctionDeclaration;
generated$3.isFunctionExpression;
generated$3.isFunctionParent;
generated$3.isFunctionTypeAnnotation;
generated$3.isFunctionTypeParam;
generated$3.isGenericTypeAnnotation;
generated$3.isIdentifier;
generated$3.isIfStatement;
generated$3.isImmutable;
generated$3.isImport;
generated$3.isImportAttribute;
generated$3.isImportDeclaration;
generated$3.isImportDefaultSpecifier;
generated$3.isImportExpression;
generated$3.isImportNamespaceSpecifier;
generated$3.isImportOrExportDeclaration;
generated$3.isImportSpecifier;
generated$3.isIndexedAccessType;
generated$3.isInferredPredicate;
generated$3.isInterfaceDeclaration;
generated$3.isInterfaceExtends;
generated$3.isInterfaceTypeAnnotation;
generated$3.isInterpreterDirective;
generated$3.isIntersectionTypeAnnotation;
generated$3.isJSX;
generated$3.isJSXAttribute;
generated$3.isJSXClosingElement;
generated$3.isJSXClosingFragment;
generated$3.isJSXElement;
generated$3.isJSXEmptyExpression;
generated$3.isJSXExpressionContainer;
generated$3.isJSXFragment;
generated$3.isJSXIdentifier;
generated$3.isJSXMemberExpression;
generated$3.isJSXNamespacedName;
generated$3.isJSXOpeningElement;
generated$3.isJSXOpeningFragment;
generated$3.isJSXSpreadAttribute;
generated$3.isJSXSpreadChild;
generated$3.isJSXText;
generated$3.isLVal;
generated$3.isLabeledStatement;
generated$3.isLiteral;
generated$3.isLogicalExpression;
generated$3.isLoop;
generated$3.isMemberExpression;
generated$3.isMetaProperty;
generated$3.isMethod;
generated$3.isMiscellaneous;
generated$3.isMixedTypeAnnotation;
generated$3.isModuleDeclaration;
generated$3.isModuleExpression;
generated$3.isModuleSpecifier;
generated$3.isNewExpression;
generated$3.isNoop;
generated$3.isNullLiteral;
generated$3.isNullLiteralTypeAnnotation;
generated$3.isNullableTypeAnnotation;
generated$3.isNumberLiteral;
generated$3.isNumberLiteralTypeAnnotation;
generated$3.isNumberTypeAnnotation;
generated$3.isNumericLiteral;
generated$3.isObjectExpression;
generated$3.isObjectMember;
generated$3.isObjectMethod;
generated$3.isObjectPattern;
generated$3.isObjectProperty;
generated$3.isObjectTypeAnnotation;
generated$3.isObjectTypeCallProperty;
generated$3.isObjectTypeIndexer;
generated$3.isObjectTypeInternalSlot;
generated$3.isObjectTypeProperty;
generated$3.isObjectTypeSpreadProperty;
generated$3.isOpaqueType;
generated$3.isOptionalCallExpression;
generated$3.isOptionalIndexedAccessType;
generated$3.isOptionalMemberExpression;
generated$3.isParenthesizedExpression;
generated$3.isPattern;
generated$3.isPatternLike;
generated$3.isPipelineBareFunction;
generated$3.isPipelinePrimaryTopicReference;
generated$3.isPipelineTopicExpression;
generated$3.isPlaceholder;
generated$3.isPrivate;
generated$3.isPrivateName;
generated$3.isProgram;
generated$3.isProperty;
generated$3.isPureish;
generated$3.isQualifiedTypeIdentifier;
generated$3.isRecordExpression;
generated$3.isRegExpLiteral;
generated$3.isRegexLiteral;
generated$3.isRestElement;
generated$3.isRestProperty;
generated$3.isReturnStatement;
generated$3.isScopable;
generated$3.isSequenceExpression;
generated$3.isSpreadElement;
generated$3.isSpreadProperty;
generated$3.isStandardized;
generated$3.isStatement;
generated$3.isStaticBlock;
generated$3.isStringLiteral;
generated$3.isStringLiteralTypeAnnotation;
generated$3.isStringTypeAnnotation;
generated$3.isSuper;
generated$3.isSwitchCase;
generated$3.isSwitchStatement;
generated$3.isSymbolTypeAnnotation;
generated$3.isTSAnyKeyword;
generated$3.isTSArrayType;
generated$3.isTSAsExpression;
generated$3.isTSBaseType;
generated$3.isTSBigIntKeyword;
generated$3.isTSBooleanKeyword;
generated$3.isTSCallSignatureDeclaration;
generated$3.isTSConditionalType;
generated$3.isTSConstructSignatureDeclaration;
generated$3.isTSConstructorType;
generated$3.isTSDeclareFunction;
generated$3.isTSDeclareMethod;
generated$3.isTSEntityName;
generated$3.isTSEnumDeclaration;
generated$3.isTSEnumMember;
generated$3.isTSExportAssignment;
generated$3.isTSExpressionWithTypeArguments;
generated$3.isTSExternalModuleReference;
generated$3.isTSFunctionType;
generated$3.isTSImportEqualsDeclaration;
generated$3.isTSImportType;
generated$3.isTSIndexSignature;
generated$3.isTSIndexedAccessType;
generated$3.isTSInferType;
generated$3.isTSInstantiationExpression;
generated$3.isTSInterfaceBody;
generated$3.isTSInterfaceDeclaration;
generated$3.isTSIntersectionType;
generated$3.isTSIntrinsicKeyword;
generated$3.isTSLiteralType;
generated$3.isTSMappedType;
generated$3.isTSMethodSignature;
generated$3.isTSModuleBlock;
generated$3.isTSModuleDeclaration;
generated$3.isTSNamedTupleMember;
generated$3.isTSNamespaceExportDeclaration;
generated$3.isTSNeverKeyword;
generated$3.isTSNonNullExpression;
generated$3.isTSNullKeyword;
generated$3.isTSNumberKeyword;
generated$3.isTSObjectKeyword;
generated$3.isTSOptionalType;
generated$3.isTSParameterProperty;
generated$3.isTSParenthesizedType;
generated$3.isTSPropertySignature;
generated$3.isTSQualifiedName;
generated$3.isTSRestType;
generated$3.isTSSatisfiesExpression;
generated$3.isTSStringKeyword;
generated$3.isTSSymbolKeyword;
generated$3.isTSThisType;
generated$3.isTSTupleType;
generated$3.isTSType;
generated$3.isTSTypeAliasDeclaration;
generated$3.isTSTypeAnnotation;
generated$3.isTSTypeAssertion;
generated$3.isTSTypeElement;
generated$3.isTSTypeLiteral;
generated$3.isTSTypeOperator;
generated$3.isTSTypeParameter;
generated$3.isTSTypeParameterDeclaration;
generated$3.isTSTypeParameterInstantiation;
generated$3.isTSTypePredicate;
generated$3.isTSTypeQuery;
generated$3.isTSTypeReference;
generated$3.isTSUndefinedKeyword;
generated$3.isTSUnionType;
generated$3.isTSUnknownKeyword;
generated$3.isTSVoidKeyword;
generated$3.isTaggedTemplateExpression;
generated$3.isTemplateElement;
generated$3.isTemplateLiteral;
generated$3.isTerminatorless;
generated$3.isThisExpression;
generated$3.isThisTypeAnnotation;
generated$3.isThrowStatement;
generated$3.isTopicReference;
generated$3.isTryStatement;
generated$3.isTupleExpression;
generated$3.isTupleTypeAnnotation;
generated$3.isTypeAlias;
generated$3.isTypeAnnotation;
generated$3.isTypeCastExpression;
generated$3.isTypeParameter;
generated$3.isTypeParameterDeclaration;
generated$3.isTypeParameterInstantiation;
generated$3.isTypeScript;
generated$3.isTypeofTypeAnnotation;
generated$3.isUnaryExpression;
generated$3.isUnaryLike;
generated$3.isUnionTypeAnnotation;
generated$3.isUpdateExpression;
generated$3.isUserWhitespacable;
generated$3.isV8IntrinsicIdentifier;
generated$3.isVariableDeclaration;
generated$3.isVariableDeclarator;
generated$3.isVariance;
generated$3.isVoidTypeAnnotation;
generated$3.isWhile;
generated$3.isWhileStatement;
generated$3.isWithStatement;
generated$3.isYieldExpression;

var matchesPattern_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = matchesPattern;

function matchesPattern(member, match, allowPartial) {
  if (!(0, generated$3.isMemberExpression)(member)) return false;
  const parts = Array.isArray(match) ? match : match.split(".");
  const nodes = [];
  let node;
  for (node = member; (0, generated$3.isMemberExpression)(node); node = node.object) {
    nodes.push(node.property);
  }
  nodes.push(node);
  if (nodes.length < parts.length) return false;
  if (!allowPartial && nodes.length > parts.length) return false;
  for (let i = 0, j = nodes.length - 1; i < parts.length; i++, j--) {
    const node = nodes[j];
    let value;
    if ((0, generated$3.isIdentifier)(node)) {
      value = node.name;
    } else if ((0, generated$3.isStringLiteral)(node)) {
      value = node.value;
    } else if ((0, generated$3.isThisExpression)(node)) {
      value = "this";
    } else {
      return false;
    }
    if (parts[i] !== value) return false;
  }
  return true;
}


});

unwrapExports(matchesPattern_1);

var buildMatchMemberExpression_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildMatchMemberExpression;

function buildMatchMemberExpression(match, allowPartial) {
  const parts = match.split(".");
  return member => (0, matchesPattern_1.default)(member, parts, allowPartial);
}


});

unwrapExports(buildMatchMemberExpression_1);

var isReactComponent_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const isReactComponent = (0, buildMatchMemberExpression_1.default)("React.Component");
exports.default = isReactComponent;


});

unwrapExports(isReactComponent_1);

var isCompatTag_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCompatTag;
function isCompatTag(tagName) {
  return !!tagName && /^[a-z]/.test(tagName);
}


});

unwrapExports(isCompatTag_1);

let fastProto = null;

// Creates an object with permanently fast properties in V8. See Toon Verwaest's
// post https://medium.com/@tverwaes/setting-up-prototypes-in-v8-ec9c9491dfe2#5f62
// for more details. Use %HasFastProperties(object) and the Node.js flag
// --allow-natives-syntax to check whether an object has fast properties.
function FastObject(o) {
	// A prototype object will have "fast properties" enabled once it is checked
	// against the inline property cache of a function, e.g. fastProto.property:
	// https://github.com/v8/v8/blob/6.0.122/test/mjsunit/fast-prototype.js#L48-L63
	if (fastProto !== null && typeof fastProto.property) {
		const result = fastProto;
		fastProto = FastObject.prototype = null;
		return result;
	}
	fastProto = FastObject.prototype = o == null ? Object.create(null) : o;
	return new FastObject;
}

// Initialize the inline property cache of FastObject
FastObject();

var toFastProperties = function toFastproperties(o) {
	return FastObject(o);
};

var isType_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isType;

function isType(nodeType, targetType) {
  if (nodeType === targetType) return true;
  if (nodeType == null) return false;
  if (definitions.ALIAS_KEYS[targetType]) return false;
  const aliases = definitions.FLIPPED_ALIAS_KEYS[targetType];
  if (aliases) {
    if (aliases[0] === nodeType) return true;
    for (const alias of aliases) {
      if (nodeType === alias) return true;
    }
  }
  return false;
}


});

unwrapExports(isType_1);

var isPlaceholderType_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isPlaceholderType;

function isPlaceholderType(placeholderType, targetType) {
  if (placeholderType === targetType) return true;
  const aliases = definitions.PLACEHOLDERS_ALIAS[placeholderType];
  if (aliases) {
    for (const alias of aliases) {
      if (targetType === alias) return true;
    }
  }
  return false;
}


});

unwrapExports(isPlaceholderType_1);

var is_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = is;




function is(type, node, opts) {
  if (!node) return false;
  const matches = (0, isType_1.default)(node.type, type);
  if (!matches) {
    if (!opts && node.type === "Placeholder" && type in definitions.FLIPPED_ALIAS_KEYS) {
      return (0, isPlaceholderType_1.default)(node.expectedNode, type);
    }
    return false;
  }
  if (typeof opts === "undefined") {
    return true;
  } else {
    return (0, shallowEqual_1.default)(node, opts);
  }
}


});

unwrapExports(is_1);

var identifier = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isIdentifierChar = isIdentifierChar;
exports.isIdentifierName = isIdentifierName;
exports.isIdentifierStart = isIdentifierStart;
let nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0560-\u0588\u05d0-\u05ea\u05ef-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u0870-\u0887\u0889-\u088e\u08a0-\u08c9\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c5d\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cdd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d04-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e86-\u0e8a\u0e8c-\u0ea3\u0ea5\u0ea7-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u1711\u171f-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1878\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4c\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1c90-\u1cba\u1cbd-\u1cbf\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1cfa\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u31a0-\u31bf\u31f0-\u31ff\u3400-\u4dbf\u4e00-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ca\ua7d0\ua7d1\ua7d3\ua7d5-\ua7d9\ua7f2-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua8fe\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab69\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
let nonASCIIidentifierChars = "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u0898-\u089f\u08ca-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u09fe\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b55-\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c04\u0c3c\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0cf3\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d81-\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0ebc\u0ec8-\u0ece\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u180f-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1abf-\u1ace\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf4\u1cf7-\u1cf9\u1dc0-\u1dff\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\u30fb\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua82c\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua8ff-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f\uff65";
const nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
const nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
const astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 4026, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 757, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191];
const astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 81, 2, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 9, 5351, 0, 7, 14, 13835, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 983, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];
function isInAstralSet(code, set) {
  let pos = 0x10000;
  for (let i = 0, length = set.length; i < length; i += 2) {
    pos += set[i];
    if (pos > code) return false;
    pos += set[i + 1];
    if (pos >= code) return true;
  }
  return false;
}
function isIdentifierStart(code) {
  if (code < 65) return code === 36;
  if (code <= 90) return true;
  if (code < 97) return code === 95;
  if (code <= 122) return true;
  if (code <= 0xffff) {
    return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
  }
  return isInAstralSet(code, astralIdentifierStartCodes);
}
function isIdentifierChar(code) {
  if (code < 48) return code === 36;
  if (code < 58) return true;
  if (code < 65) return false;
  if (code <= 90) return true;
  if (code < 97) return code === 95;
  if (code <= 122) return true;
  if (code <= 0xffff) {
    return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
  }
  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
}
function isIdentifierName(name) {
  let isFirst = true;
  for (let i = 0; i < name.length; i++) {
    let cp = name.charCodeAt(i);
    if ((cp & 0xfc00) === 0xd800 && i + 1 < name.length) {
      const trail = name.charCodeAt(++i);
      if ((trail & 0xfc00) === 0xdc00) {
        cp = 0x10000 + ((cp & 0x3ff) << 10) + (trail & 0x3ff);
      }
    }
    if (isFirst) {
      isFirst = false;
      if (!isIdentifierStart(cp)) {
        return false;
      }
    } else if (!isIdentifierChar(cp)) {
      return false;
    }
  }
  return !isFirst;
}


});

unwrapExports(identifier);
identifier.isIdentifierChar;
identifier.isIdentifierName;
identifier.isIdentifierStart;

var keyword = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isKeyword = isKeyword;
exports.isReservedWord = isReservedWord;
exports.isStrictBindOnlyReservedWord = isStrictBindOnlyReservedWord;
exports.isStrictBindReservedWord = isStrictBindReservedWord;
exports.isStrictReservedWord = isStrictReservedWord;
const reservedWords = {
  keyword: ["break", "case", "catch", "continue", "debugger", "default", "do", "else", "finally", "for", "function", "if", "return", "switch", "throw", "try", "var", "const", "while", "with", "new", "this", "super", "class", "extends", "export", "import", "null", "true", "false", "in", "instanceof", "typeof", "void", "delete"],
  strict: ["implements", "interface", "let", "package", "private", "protected", "public", "static", "yield"],
  strictBind: ["eval", "arguments"]
};
const keywords = new Set(reservedWords.keyword);
const reservedWordsStrictSet = new Set(reservedWords.strict);
const reservedWordsStrictBindSet = new Set(reservedWords.strictBind);
function isReservedWord(word, inModule) {
  return inModule && word === "await" || word === "enum";
}
function isStrictReservedWord(word, inModule) {
  return isReservedWord(word, inModule) || reservedWordsStrictSet.has(word);
}
function isStrictBindOnlyReservedWord(word) {
  return reservedWordsStrictBindSet.has(word);
}
function isStrictBindReservedWord(word, inModule) {
  return isStrictReservedWord(word, inModule) || isStrictBindOnlyReservedWord(word);
}
function isKeyword(word) {
  return keywords.has(word);
}


});

unwrapExports(keyword);
keyword.isKeyword;
keyword.isReservedWord;
keyword.isStrictBindOnlyReservedWord;
keyword.isStrictBindReservedWord;
keyword.isStrictReservedWord;

var lib$2 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "isIdentifierChar", {
  enumerable: true,
  get: function () {
    return identifier.isIdentifierChar;
  }
});
Object.defineProperty(exports, "isIdentifierName", {
  enumerable: true,
  get: function () {
    return identifier.isIdentifierName;
  }
});
Object.defineProperty(exports, "isIdentifierStart", {
  enumerable: true,
  get: function () {
    return identifier.isIdentifierStart;
  }
});
Object.defineProperty(exports, "isKeyword", {
  enumerable: true,
  get: function () {
    return keyword.isKeyword;
  }
});
Object.defineProperty(exports, "isReservedWord", {
  enumerable: true,
  get: function () {
    return keyword.isReservedWord;
  }
});
Object.defineProperty(exports, "isStrictBindOnlyReservedWord", {
  enumerable: true,
  get: function () {
    return keyword.isStrictBindOnlyReservedWord;
  }
});
Object.defineProperty(exports, "isStrictBindReservedWord", {
  enumerable: true,
  get: function () {
    return keyword.isStrictBindReservedWord;
  }
});
Object.defineProperty(exports, "isStrictReservedWord", {
  enumerable: true,
  get: function () {
    return keyword.isStrictReservedWord;
  }
});




});

unwrapExports(lib$2);

var isValidIdentifier_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isValidIdentifier;

function isValidIdentifier(name, reserved = true) {
  if (typeof name !== "string") return false;
  if (reserved) {
    if ((0, lib$2.isKeyword)(name) || (0, lib$2.isStrictReservedWord)(name, true)) {
      return false;
    }
  }
  return (0, lib$2.isIdentifierName)(name);
}


});

unwrapExports(isValidIdentifier_1);

var lib$1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readCodePoint = readCodePoint;
exports.readInt = readInt;
exports.readStringContents = readStringContents;
var _isDigit = function isDigit(code) {
  return code >= 48 && code <= 57;
};
const forbiddenNumericSeparatorSiblings = {
  decBinOct: new Set([46, 66, 69, 79, 95, 98, 101, 111]),
  hex: new Set([46, 88, 95, 120])
};
const isAllowedNumericSeparatorSibling = {
  bin: ch => ch === 48 || ch === 49,
  oct: ch => ch >= 48 && ch <= 55,
  dec: ch => ch >= 48 && ch <= 57,
  hex: ch => ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102
};
function readStringContents(type, input, pos, lineStart, curLine, errors) {
  const initialPos = pos;
  const initialLineStart = lineStart;
  const initialCurLine = curLine;
  let out = "";
  let firstInvalidLoc = null;
  let chunkStart = pos;
  const {
    length
  } = input;
  for (;;) {
    if (pos >= length) {
      errors.unterminated(initialPos, initialLineStart, initialCurLine);
      out += input.slice(chunkStart, pos);
      break;
    }
    const ch = input.charCodeAt(pos);
    if (isStringEnd(type, ch, input, pos)) {
      out += input.slice(chunkStart, pos);
      break;
    }
    if (ch === 92) {
      out += input.slice(chunkStart, pos);
      const res = readEscapedChar(input, pos, lineStart, curLine, type === "template", errors);
      if (res.ch === null && !firstInvalidLoc) {
        firstInvalidLoc = {
          pos,
          lineStart,
          curLine
        };
      } else {
        out += res.ch;
      }
      ({
        pos,
        lineStart,
        curLine
      } = res);
      chunkStart = pos;
    } else if (ch === 8232 || ch === 8233) {
      ++pos;
      ++curLine;
      lineStart = pos;
    } else if (ch === 10 || ch === 13) {
      if (type === "template") {
        out += input.slice(chunkStart, pos) + "\n";
        ++pos;
        if (ch === 13 && input.charCodeAt(pos) === 10) {
          ++pos;
        }
        ++curLine;
        chunkStart = lineStart = pos;
      } else {
        errors.unterminated(initialPos, initialLineStart, initialCurLine);
      }
    } else {
      ++pos;
    }
  }
  return {
    pos,
    str: out,
    firstInvalidLoc,
    lineStart,
    curLine,
    containsInvalid: !!firstInvalidLoc
  };
}
function isStringEnd(type, ch, input, pos) {
  if (type === "template") {
    return ch === 96 || ch === 36 && input.charCodeAt(pos + 1) === 123;
  }
  return ch === (type === "double" ? 34 : 39);
}
function readEscapedChar(input, pos, lineStart, curLine, inTemplate, errors) {
  const throwOnInvalid = !inTemplate;
  pos++;
  const res = ch => ({
    pos,
    ch,
    lineStart,
    curLine
  });
  const ch = input.charCodeAt(pos++);
  switch (ch) {
    case 110:
      return res("\n");
    case 114:
      return res("\r");
    case 120:
      {
        let code;
        ({
          code,
          pos
        } = readHexChar(input, pos, lineStart, curLine, 2, false, throwOnInvalid, errors));
        return res(code === null ? null : String.fromCharCode(code));
      }
    case 117:
      {
        let code;
        ({
          code,
          pos
        } = readCodePoint(input, pos, lineStart, curLine, throwOnInvalid, errors));
        return res(code === null ? null : String.fromCodePoint(code));
      }
    case 116:
      return res("\t");
    case 98:
      return res("\b");
    case 118:
      return res("\u000b");
    case 102:
      return res("\f");
    case 13:
      if (input.charCodeAt(pos) === 10) {
        ++pos;
      }
    case 10:
      lineStart = pos;
      ++curLine;
    case 8232:
    case 8233:
      return res("");
    case 56:
    case 57:
      if (inTemplate) {
        return res(null);
      } else {
        errors.strictNumericEscape(pos - 1, lineStart, curLine);
      }
    default:
      if (ch >= 48 && ch <= 55) {
        const startPos = pos - 1;
        const match = input.slice(startPos, pos + 2).match(/^[0-7]+/);
        let octalStr = match[0];
        let octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        pos += octalStr.length - 1;
        const next = input.charCodeAt(pos);
        if (octalStr !== "0" || next === 56 || next === 57) {
          if (inTemplate) {
            return res(null);
          } else {
            errors.strictNumericEscape(startPos, lineStart, curLine);
          }
        }
        return res(String.fromCharCode(octal));
      }
      return res(String.fromCharCode(ch));
  }
}
function readHexChar(input, pos, lineStart, curLine, len, forceLen, throwOnInvalid, errors) {
  const initialPos = pos;
  let n;
  ({
    n,
    pos
  } = readInt(input, pos, lineStart, curLine, 16, len, forceLen, false, errors, !throwOnInvalid));
  if (n === null) {
    if (throwOnInvalid) {
      errors.invalidEscapeSequence(initialPos, lineStart, curLine);
    } else {
      pos = initialPos - 1;
    }
  }
  return {
    code: n,
    pos
  };
}
function readInt(input, pos, lineStart, curLine, radix, len, forceLen, allowNumSeparator, errors, bailOnError) {
  const start = pos;
  const forbiddenSiblings = radix === 16 ? forbiddenNumericSeparatorSiblings.hex : forbiddenNumericSeparatorSiblings.decBinOct;
  const isAllowedSibling = radix === 16 ? isAllowedNumericSeparatorSibling.hex : radix === 10 ? isAllowedNumericSeparatorSibling.dec : radix === 8 ? isAllowedNumericSeparatorSibling.oct : isAllowedNumericSeparatorSibling.bin;
  let invalid = false;
  let total = 0;
  for (let i = 0, e = len == null ? Infinity : len; i < e; ++i) {
    const code = input.charCodeAt(pos);
    let val;
    if (code === 95 && allowNumSeparator !== "bail") {
      const prev = input.charCodeAt(pos - 1);
      const next = input.charCodeAt(pos + 1);
      if (!allowNumSeparator) {
        if (bailOnError) return {
          n: null,
          pos
        };
        errors.numericSeparatorInEscapeSequence(pos, lineStart, curLine);
      } else if (Number.isNaN(next) || !isAllowedSibling(next) || forbiddenSiblings.has(prev) || forbiddenSiblings.has(next)) {
        if (bailOnError) return {
          n: null,
          pos
        };
        errors.unexpectedNumericSeparator(pos, lineStart, curLine);
      }
      ++pos;
      continue;
    }
    if (code >= 97) {
      val = code - 97 + 10;
    } else if (code >= 65) {
      val = code - 65 + 10;
    } else if (_isDigit(code)) {
      val = code - 48;
    } else {
      val = Infinity;
    }
    if (val >= radix) {
      if (val <= 9 && bailOnError) {
        return {
          n: null,
          pos
        };
      } else if (val <= 9 && errors.invalidDigit(pos, lineStart, curLine, radix)) {
        val = 0;
      } else if (forceLen) {
        val = 0;
        invalid = true;
      } else {
        break;
      }
    }
    ++pos;
    total = total * radix + val;
  }
  if (pos === start || len != null && pos - start !== len || invalid) {
    return {
      n: null,
      pos
    };
  }
  return {
    n: total,
    pos
  };
}
function readCodePoint(input, pos, lineStart, curLine, throwOnInvalid, errors) {
  const ch = input.charCodeAt(pos);
  let code;
  if (ch === 123) {
    ++pos;
    ({
      code,
      pos
    } = readHexChar(input, pos, lineStart, curLine, input.indexOf("}", pos) - pos, true, throwOnInvalid, errors));
    ++pos;
    if (code !== null && code > 0x10ffff) {
      if (throwOnInvalid) {
        errors.invalidCodePoint(pos, lineStart, curLine);
      } else {
        return {
          code: null,
          pos
        };
      }
    }
  } else {
    ({
      code,
      pos
    } = readHexChar(input, pos, lineStart, curLine, 4, false, throwOnInvalid, errors));
  }
  return {
    code,
    pos
  };
}


});

unwrapExports(lib$1);
lib$1.readCodePoint;
lib$1.readInt;
lib$1.readStringContents;

var constants$1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPDATE_OPERATORS = exports.UNARY_OPERATORS = exports.STRING_UNARY_OPERATORS = exports.STATEMENT_OR_BLOCK_KEYS = exports.NUMBER_UNARY_OPERATORS = exports.NUMBER_BINARY_OPERATORS = exports.NOT_LOCAL_BINDING = exports.LOGICAL_OPERATORS = exports.INHERIT_KEYS = exports.FOR_INIT_KEYS = exports.FLATTENABLE_KEYS = exports.EQUALITY_BINARY_OPERATORS = exports.COMPARISON_BINARY_OPERATORS = exports.COMMENT_KEYS = exports.BOOLEAN_UNARY_OPERATORS = exports.BOOLEAN_NUMBER_BINARY_OPERATORS = exports.BOOLEAN_BINARY_OPERATORS = exports.BLOCK_SCOPED_SYMBOL = exports.BINARY_OPERATORS = exports.ASSIGNMENT_OPERATORS = void 0;
exports.STATEMENT_OR_BLOCK_KEYS = ["consequent", "body", "alternate"];
exports.FLATTENABLE_KEYS = ["body", "expressions"];
exports.FOR_INIT_KEYS = ["left", "init"];
exports.COMMENT_KEYS = ["leadingComments", "trailingComments", "innerComments"];
const LOGICAL_OPERATORS = exports.LOGICAL_OPERATORS = ["||", "&&", "??"];
exports.UPDATE_OPERATORS = ["++", "--"];
const BOOLEAN_NUMBER_BINARY_OPERATORS = exports.BOOLEAN_NUMBER_BINARY_OPERATORS = [">", "<", ">=", "<="];
const EQUALITY_BINARY_OPERATORS = exports.EQUALITY_BINARY_OPERATORS = ["==", "===", "!=", "!=="];
const COMPARISON_BINARY_OPERATORS = exports.COMPARISON_BINARY_OPERATORS = [...EQUALITY_BINARY_OPERATORS, "in", "instanceof"];
const BOOLEAN_BINARY_OPERATORS = exports.BOOLEAN_BINARY_OPERATORS = [...COMPARISON_BINARY_OPERATORS, ...BOOLEAN_NUMBER_BINARY_OPERATORS];
const NUMBER_BINARY_OPERATORS = exports.NUMBER_BINARY_OPERATORS = ["-", "/", "%", "*", "**", "&", "|", ">>", ">>>", "<<", "^"];
exports.BINARY_OPERATORS = ["+", ...NUMBER_BINARY_OPERATORS, ...BOOLEAN_BINARY_OPERATORS, "|>"];
exports.ASSIGNMENT_OPERATORS = ["=", "+=", ...NUMBER_BINARY_OPERATORS.map(op => op + "="), ...LOGICAL_OPERATORS.map(op => op + "=")];
const BOOLEAN_UNARY_OPERATORS = exports.BOOLEAN_UNARY_OPERATORS = ["delete", "!"];
const NUMBER_UNARY_OPERATORS = exports.NUMBER_UNARY_OPERATORS = ["+", "-", "~"];
const STRING_UNARY_OPERATORS = exports.STRING_UNARY_OPERATORS = ["typeof"];
exports.UNARY_OPERATORS = ["void", "throw", ...BOOLEAN_UNARY_OPERATORS, ...NUMBER_UNARY_OPERATORS, ...STRING_UNARY_OPERATORS];
exports.INHERIT_KEYS = {
  optional: ["typeAnnotation", "typeParameters", "returnType"],
  force: ["start", "loc", "end"]
};
exports.BLOCK_SCOPED_SYMBOL = Symbol.for("var used to be block scoped");
exports.NOT_LOCAL_BINDING = Symbol.for("should not be considered a local binding");


});

unwrapExports(constants$1);
constants$1.UPDATE_OPERATORS;
constants$1.UNARY_OPERATORS;
constants$1.STRING_UNARY_OPERATORS;
constants$1.STATEMENT_OR_BLOCK_KEYS;
constants$1.NUMBER_UNARY_OPERATORS;
constants$1.NUMBER_BINARY_OPERATORS;
constants$1.NOT_LOCAL_BINDING;
constants$1.LOGICAL_OPERATORS;
constants$1.INHERIT_KEYS;
constants$1.FOR_INIT_KEYS;
constants$1.FLATTENABLE_KEYS;
constants$1.EQUALITY_BINARY_OPERATORS;
constants$1.COMPARISON_BINARY_OPERATORS;
constants$1.COMMENT_KEYS;
constants$1.BOOLEAN_UNARY_OPERATORS;
constants$1.BOOLEAN_NUMBER_BINARY_OPERATORS;
constants$1.BOOLEAN_BINARY_OPERATORS;
constants$1.BLOCK_SCOPED_SYMBOL;
constants$1.BINARY_OPERATORS;
constants$1.ASSIGNMENT_OPERATORS;

var utils = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VISITOR_KEYS = exports.NODE_PARENT_VALIDATIONS = exports.NODE_FIELDS = exports.FLIPPED_ALIAS_KEYS = exports.DEPRECATED_KEYS = exports.BUILDER_KEYS = exports.ALIAS_KEYS = void 0;
exports.arrayOf = arrayOf;
exports.arrayOfType = arrayOfType;
exports.assertEach = assertEach;
exports.assertNodeOrValueType = assertNodeOrValueType;
exports.assertNodeType = assertNodeType;
exports.assertOneOf = assertOneOf;
exports.assertOptionalChainStart = assertOptionalChainStart;
exports.assertShape = assertShape;
exports.assertValueType = assertValueType;
exports.chain = chain;
exports.default = defineType;
exports.defineAliasedType = defineAliasedType;
exports.typeIs = typeIs;
exports.validate = validate;
exports.validateArrayOfType = validateArrayOfType;
exports.validateOptional = validateOptional;
exports.validateOptionalType = validateOptionalType;
exports.validateType = validateType;


const VISITOR_KEYS = exports.VISITOR_KEYS = {};
const ALIAS_KEYS = exports.ALIAS_KEYS = {};
const FLIPPED_ALIAS_KEYS = exports.FLIPPED_ALIAS_KEYS = {};
const NODE_FIELDS = exports.NODE_FIELDS = {};
const BUILDER_KEYS = exports.BUILDER_KEYS = {};
const DEPRECATED_KEYS = exports.DEPRECATED_KEYS = {};
const NODE_PARENT_VALIDATIONS = exports.NODE_PARENT_VALIDATIONS = {};
function getType(val) {
  if (Array.isArray(val)) {
    return "array";
  } else if (val === null) {
    return "null";
  } else {
    return typeof val;
  }
}
function validate(validate) {
  return {
    validate
  };
}
function typeIs(typeName) {
  return typeof typeName === "string" ? assertNodeType(typeName) : assertNodeType(...typeName);
}
function validateType(typeName) {
  return validate(typeIs(typeName));
}
function validateOptional(validate) {
  return {
    validate,
    optional: true
  };
}
function validateOptionalType(typeName) {
  return {
    validate: typeIs(typeName),
    optional: true
  };
}
function arrayOf(elementType) {
  return chain(assertValueType("array"), assertEach(elementType));
}
function arrayOfType(typeName) {
  return arrayOf(typeIs(typeName));
}
function validateArrayOfType(typeName) {
  return validate(arrayOfType(typeName));
}
function assertEach(callback) {
  function validator(node, key, val) {
    if (!Array.isArray(val)) return;
    for (let i = 0; i < val.length; i++) {
      const subkey = `${key}[${i}]`;
      const v = val[i];
      callback(node, subkey, v);
      if (process.env.BABEL_TYPES_8_BREAKING) (0, validate_1.validateChild)(node, subkey, v);
    }
  }
  validator.each = callback;
  return validator;
}
function assertOneOf(...values) {
  function validate(node, key, val) {
    if (values.indexOf(val) < 0) {
      throw new TypeError(`Property ${key} expected value to be one of ${JSON.stringify(values)} but got ${JSON.stringify(val)}`);
    }
  }
  validate.oneOf = values;
  return validate;
}
function assertNodeType(...types) {
  function validate(node, key, val) {
    for (const type of types) {
      if ((0, is_1.default)(type, val)) {
        (0, validate_1.validateChild)(node, key, val);
        return;
      }
    }
    throw new TypeError(`Property ${key} of ${node.type} expected node to be of a type ${JSON.stringify(types)} but instead got ${JSON.stringify(val == null ? void 0 : val.type)}`);
  }
  validate.oneOfNodeTypes = types;
  return validate;
}
function assertNodeOrValueType(...types) {
  function validate(node, key, val) {
    for (const type of types) {
      if (getType(val) === type || (0, is_1.default)(type, val)) {
        (0, validate_1.validateChild)(node, key, val);
        return;
      }
    }
    throw new TypeError(`Property ${key} of ${node.type} expected node to be of a type ${JSON.stringify(types)} but instead got ${JSON.stringify(val == null ? void 0 : val.type)}`);
  }
  validate.oneOfNodeOrValueTypes = types;
  return validate;
}
function assertValueType(type) {
  function validate(node, key, val) {
    const valid = getType(val) === type;
    if (!valid) {
      throw new TypeError(`Property ${key} expected type of ${type} but got ${getType(val)}`);
    }
  }
  validate.type = type;
  return validate;
}
function assertShape(shape) {
  function validate(node, key, val) {
    const errors = [];
    for (const property of Object.keys(shape)) {
      try {
        (0, validate_1.validateField)(node, property, val[property], shape[property]);
      } catch (error) {
        if (error instanceof TypeError) {
          errors.push(error.message);
          continue;
        }
        throw error;
      }
    }
    if (errors.length) {
      throw new TypeError(`Property ${key} of ${node.type} expected to have the following:\n${errors.join("\n")}`);
    }
  }
  validate.shapeOf = shape;
  return validate;
}
function assertOptionalChainStart() {
  function validate(node) {
    var _current;
    let current = node;
    while (node) {
      const {
        type
      } = current;
      if (type === "OptionalCallExpression") {
        if (current.optional) return;
        current = current.callee;
        continue;
      }
      if (type === "OptionalMemberExpression") {
        if (current.optional) return;
        current = current.object;
        continue;
      }
      break;
    }
    throw new TypeError(`Non-optional ${node.type} must chain from an optional OptionalMemberExpression or OptionalCallExpression. Found chain from ${(_current = current) == null ? void 0 : _current.type}`);
  }
  return validate;
}
function chain(...fns) {
  function validate(...args) {
    for (const fn of fns) {
      fn(...args);
    }
  }
  validate.chainOf = fns;
  if (fns.length >= 2 && "type" in fns[0] && fns[0].type === "array" && !("each" in fns[1])) {
    throw new Error(`An assertValueType("array") validator can only be followed by an assertEach(...) validator.`);
  }
  return validate;
}
const validTypeOpts = ["aliases", "builder", "deprecatedAlias", "fields", "inherits", "visitor", "validate"];
const validFieldKeys = ["default", "optional", "deprecated", "validate"];
const store = {};
function defineAliasedType(...aliases) {
  return (type, opts = {}) => {
    let defined = opts.aliases;
    if (!defined) {
      var _store$opts$inherits$, _defined;
      if (opts.inherits) defined = (_store$opts$inherits$ = store[opts.inherits].aliases) == null ? void 0 : _store$opts$inherits$.slice();
      (_defined = defined) != null ? _defined : defined = [];
      opts.aliases = defined;
    }
    const additional = aliases.filter(a => !defined.includes(a));
    defined.unshift(...additional);
    defineType(type, opts);
  };
}
function defineType(type, opts = {}) {
  const inherits = opts.inherits && store[opts.inherits] || {};
  let fields = opts.fields;
  if (!fields) {
    fields = {};
    if (inherits.fields) {
      const keys = Object.getOwnPropertyNames(inherits.fields);
      for (const key of keys) {
        const field = inherits.fields[key];
        const def = field.default;
        if (Array.isArray(def) ? def.length > 0 : def && typeof def === "object") {
          throw new Error("field defaults can only be primitives or empty arrays currently");
        }
        fields[key] = {
          default: Array.isArray(def) ? [] : def,
          optional: field.optional,
          deprecated: field.deprecated,
          validate: field.validate
        };
      }
    }
  }
  const visitor = opts.visitor || inherits.visitor || [];
  const aliases = opts.aliases || inherits.aliases || [];
  const builder = opts.builder || inherits.builder || opts.visitor || [];
  for (const k of Object.keys(opts)) {
    if (validTypeOpts.indexOf(k) === -1) {
      throw new Error(`Unknown type option "${k}" on ${type}`);
    }
  }
  if (opts.deprecatedAlias) {
    DEPRECATED_KEYS[opts.deprecatedAlias] = type;
  }
  for (const key of visitor.concat(builder)) {
    fields[key] = fields[key] || {};
  }
  for (const key of Object.keys(fields)) {
    const field = fields[key];
    if (field.default !== undefined && builder.indexOf(key) === -1) {
      field.optional = true;
    }
    if (field.default === undefined) {
      field.default = null;
    } else if (!field.validate && field.default != null) {
      field.validate = assertValueType(getType(field.default));
    }
    for (const k of Object.keys(field)) {
      if (validFieldKeys.indexOf(k) === -1) {
        throw new Error(`Unknown field key "${k}" on ${type}.${key}`);
      }
    }
  }
  VISITOR_KEYS[type] = opts.visitor = visitor;
  BUILDER_KEYS[type] = opts.builder = builder;
  NODE_FIELDS[type] = opts.fields = fields;
  ALIAS_KEYS[type] = opts.aliases = aliases;
  aliases.forEach(alias => {
    FLIPPED_ALIAS_KEYS[alias] = FLIPPED_ALIAS_KEYS[alias] || [];
    FLIPPED_ALIAS_KEYS[alias].push(type);
  });
  if (opts.validate) {
    NODE_PARENT_VALIDATIONS[type] = opts.validate;
  }
  store[type] = opts;
}


});

unwrapExports(utils);
utils.VISITOR_KEYS;
utils.NODE_PARENT_VALIDATIONS;
utils.NODE_FIELDS;
utils.FLIPPED_ALIAS_KEYS;
utils.DEPRECATED_KEYS;
utils.BUILDER_KEYS;
utils.ALIAS_KEYS;
utils.arrayOf;
utils.arrayOfType;
utils.assertEach;
utils.assertNodeOrValueType;
utils.assertNodeType;
utils.assertOneOf;
utils.assertOptionalChainStart;
utils.assertShape;
utils.assertValueType;
utils.chain;
utils.defineAliasedType;
utils.typeIs;
utils.validate;
utils.validateArrayOfType;
utils.validateOptional;
utils.validateOptionalType;
utils.validateType;

var core = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patternLikeCommon = exports.functionTypeAnnotationCommon = exports.functionDeclarationCommon = exports.functionCommon = exports.classMethodOrPropertyCommon = exports.classMethodOrDeclareMethodCommon = void 0;






const defineType = (0, utils.defineAliasedType)("Standardized");
defineType("ArrayExpression", {
  fields: {
    elements: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeOrValueType)("null", "Expression", "SpreadElement"))),
      default: !process.env.BABEL_TYPES_8_BREAKING ? [] : undefined
    }
  },
  visitor: ["elements"],
  aliases: ["Expression"]
});
defineType("AssignmentExpression", {
  fields: {
    operator: {
      validate: function () {
        if (!process.env.BABEL_TYPES_8_BREAKING) {
          return (0, utils.assertValueType)("string");
        }
        const identifier = (0, utils.assertOneOf)(...constants$1.ASSIGNMENT_OPERATORS);
        const pattern = (0, utils.assertOneOf)("=");
        return function (node, key, val) {
          const validator = (0, is_1.default)("Pattern", node.left) ? pattern : identifier;
          validator(node, key, val);
        };
      }()
    },
    left: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, utils.assertNodeType)("LVal", "OptionalMemberExpression") : (0, utils.assertNodeType)("Identifier", "MemberExpression", "OptionalMemberExpression", "ArrayPattern", "ObjectPattern", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression")
    },
    right: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  },
  builder: ["operator", "left", "right"],
  visitor: ["left", "right"],
  aliases: ["Expression"]
});
defineType("BinaryExpression", {
  builder: ["operator", "left", "right"],
  fields: {
    operator: {
      validate: (0, utils.assertOneOf)(...constants$1.BINARY_OPERATORS)
    },
    left: {
      validate: function () {
        const expression = (0, utils.assertNodeType)("Expression");
        const inOp = (0, utils.assertNodeType)("Expression", "PrivateName");
        const validator = Object.assign(function (node, key, val) {
          const validator = node.operator === "in" ? inOp : expression;
          validator(node, key, val);
        }, {
          oneOfNodeTypes: ["Expression", "PrivateName"]
        });
        return validator;
      }()
    },
    right: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  },
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"]
});
defineType("InterpreterDirective", {
  builder: ["value"],
  fields: {
    value: {
      validate: (0, utils.assertValueType)("string")
    }
  }
});
defineType("Directive", {
  visitor: ["value"],
  fields: {
    value: {
      validate: (0, utils.assertNodeType)("DirectiveLiteral")
    }
  }
});
defineType("DirectiveLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: (0, utils.assertValueType)("string")
    }
  }
});
defineType("BlockStatement", {
  builder: ["body", "directives"],
  visitor: ["directives", "body"],
  fields: {
    directives: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Directive"))),
      default: []
    },
    body: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Statement")))
    }
  },
  aliases: ["Scopable", "BlockParent", "Block", "Statement"]
});
defineType("BreakStatement", {
  visitor: ["label"],
  fields: {
    label: {
      validate: (0, utils.assertNodeType)("Identifier"),
      optional: true
    }
  },
  aliases: ["Statement", "Terminatorless", "CompletionStatement"]
});
defineType("CallExpression", {
  visitor: ["callee", "arguments", "typeParameters", "typeArguments"],
  builder: ["callee", "arguments"],
  aliases: ["Expression"],
  fields: Object.assign({
    callee: {
      validate: (0, utils.assertNodeType)("Expression", "Super", "V8IntrinsicIdentifier")
    },
    arguments: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Expression", "SpreadElement", "JSXNamespacedName", "ArgumentPlaceholder")))
    }
  }, !process.env.BABEL_TYPES_8_BREAKING ? {
    optional: {
      validate: (0, utils.assertOneOf)(true, false),
      optional: true
    }
  } : {}, {
    typeArguments: {
      validate: (0, utils.assertNodeType)("TypeParameterInstantiation"),
      optional: true
    },
    typeParameters: {
      validate: (0, utils.assertNodeType)("TSTypeParameterInstantiation"),
      optional: true
    }
  })
});
defineType("CatchClause", {
  visitor: ["param", "body"],
  fields: {
    param: {
      validate: (0, utils.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern"),
      optional: true
    },
    body: {
      validate: (0, utils.assertNodeType)("BlockStatement")
    }
  },
  aliases: ["Scopable", "BlockParent"]
});
defineType("ConditionalExpression", {
  visitor: ["test", "consequent", "alternate"],
  fields: {
    test: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    consequent: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    alternate: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  },
  aliases: ["Expression", "Conditional"]
});
defineType("ContinueStatement", {
  visitor: ["label"],
  fields: {
    label: {
      validate: (0, utils.assertNodeType)("Identifier"),
      optional: true
    }
  },
  aliases: ["Statement", "Terminatorless", "CompletionStatement"]
});
defineType("DebuggerStatement", {
  aliases: ["Statement"]
});
defineType("DoWhileStatement", {
  visitor: ["test", "body"],
  fields: {
    test: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    body: {
      validate: (0, utils.assertNodeType)("Statement")
    }
  },
  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"]
});
defineType("EmptyStatement", {
  aliases: ["Statement"]
});
defineType("ExpressionStatement", {
  visitor: ["expression"],
  fields: {
    expression: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  },
  aliases: ["Statement", "ExpressionWrapper"]
});
defineType("File", {
  builder: ["program", "comments", "tokens"],
  visitor: ["program"],
  fields: {
    program: {
      validate: (0, utils.assertNodeType)("Program")
    },
    comments: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? Object.assign(() => {}, {
        each: {
          oneOfNodeTypes: ["CommentBlock", "CommentLine"]
        }
      }) : (0, utils.assertEach)((0, utils.assertNodeType)("CommentBlock", "CommentLine")),
      optional: true
    },
    tokens: {
      validate: (0, utils.assertEach)(Object.assign(() => {}, {
        type: "any"
      })),
      optional: true
    }
  }
});
defineType("ForInStatement", {
  visitor: ["left", "right", "body"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop", "ForXStatement"],
  fields: {
    left: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, utils.assertNodeType)("VariableDeclaration", "LVal") : (0, utils.assertNodeType)("VariableDeclaration", "Identifier", "MemberExpression", "ArrayPattern", "ObjectPattern", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression")
    },
    right: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    body: {
      validate: (0, utils.assertNodeType)("Statement")
    }
  }
});
defineType("ForStatement", {
  visitor: ["init", "test", "update", "body"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop"],
  fields: {
    init: {
      validate: (0, utils.assertNodeType)("VariableDeclaration", "Expression"),
      optional: true
    },
    test: {
      validate: (0, utils.assertNodeType)("Expression"),
      optional: true
    },
    update: {
      validate: (0, utils.assertNodeType)("Expression"),
      optional: true
    },
    body: {
      validate: (0, utils.assertNodeType)("Statement")
    }
  }
});
const functionCommon = () => ({
  params: {
    validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Identifier", "Pattern", "RestElement")))
  },
  generator: {
    default: false
  },
  async: {
    default: false
  }
});
exports.functionCommon = functionCommon;
const functionTypeAnnotationCommon = () => ({
  returnType: {
    validate: (0, utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
    optional: true
  },
  typeParameters: {
    validate: (0, utils.assertNodeType)("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
    optional: true
  }
});
exports.functionTypeAnnotationCommon = functionTypeAnnotationCommon;
const functionDeclarationCommon = () => Object.assign({}, functionCommon(), {
  declare: {
    validate: (0, utils.assertValueType)("boolean"),
    optional: true
  },
  id: {
    validate: (0, utils.assertNodeType)("Identifier"),
    optional: true
  }
});
exports.functionDeclarationCommon = functionDeclarationCommon;
defineType("FunctionDeclaration", {
  builder: ["id", "params", "body", "generator", "async"],
  visitor: ["id", "params", "body", "returnType", "typeParameters"],
  fields: Object.assign({}, functionDeclarationCommon(), functionTypeAnnotationCommon(), {
    body: {
      validate: (0, utils.assertNodeType)("BlockStatement")
    },
    predicate: {
      validate: (0, utils.assertNodeType)("DeclaredPredicate", "InferredPredicate"),
      optional: true
    }
  }),
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Statement", "Pureish", "Declaration"],
  validate: function () {
    if (!process.env.BABEL_TYPES_8_BREAKING) return () => {};
    const identifier = (0, utils.assertNodeType)("Identifier");
    return function (parent, key, node) {
      if (!(0, is_1.default)("ExportDefaultDeclaration", parent)) {
        identifier(node, "id", node.id);
      }
    };
  }()
});
defineType("FunctionExpression", {
  inherits: "FunctionDeclaration",
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Expression", "Pureish"],
  fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
    id: {
      validate: (0, utils.assertNodeType)("Identifier"),
      optional: true
    },
    body: {
      validate: (0, utils.assertNodeType)("BlockStatement")
    },
    predicate: {
      validate: (0, utils.assertNodeType)("DeclaredPredicate", "InferredPredicate"),
      optional: true
    }
  })
});
const patternLikeCommon = () => ({
  typeAnnotation: {
    validate: (0, utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
    optional: true
  },
  optional: {
    validate: (0, utils.assertValueType)("boolean"),
    optional: true
  },
  decorators: {
    validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Decorator"))),
    optional: true
  }
});
exports.patternLikeCommon = patternLikeCommon;
defineType("Identifier", {
  builder: ["name"],
  visitor: ["typeAnnotation", "decorators"],
  aliases: ["Expression", "PatternLike", "LVal", "TSEntityName"],
  fields: Object.assign({}, patternLikeCommon(), {
    name: {
      validate: (0, utils.chain)((0, utils.assertValueType)("string"), Object.assign(function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;
        if (!(0, isValidIdentifier_1.default)(val, false)) {
          throw new TypeError(`"${val}" is not a valid identifier name`);
        }
      }, {
        type: "string"
      }))
    }
  }),
  validate(parent, key, node) {
    if (!process.env.BABEL_TYPES_8_BREAKING) return;
    const match = /\.(\w+)$/.exec(key);
    if (!match) return;
    const [, parentKey] = match;
    const nonComp = {
      computed: false
    };
    if (parentKey === "property") {
      if ((0, is_1.default)("MemberExpression", parent, nonComp)) return;
      if ((0, is_1.default)("OptionalMemberExpression", parent, nonComp)) return;
    } else if (parentKey === "key") {
      if ((0, is_1.default)("Property", parent, nonComp)) return;
      if ((0, is_1.default)("Method", parent, nonComp)) return;
    } else if (parentKey === "exported") {
      if ((0, is_1.default)("ExportSpecifier", parent)) return;
    } else if (parentKey === "imported") {
      if ((0, is_1.default)("ImportSpecifier", parent, {
        imported: node
      })) return;
    } else if (parentKey === "meta") {
      if ((0, is_1.default)("MetaProperty", parent, {
        meta: node
      })) return;
    }
    if (((0, lib$2.isKeyword)(node.name) || (0, lib$2.isReservedWord)(node.name, false)) && node.name !== "this") {
      throw new TypeError(`"${node.name}" is not a valid identifier`);
    }
  }
});
defineType("IfStatement", {
  visitor: ["test", "consequent", "alternate"],
  aliases: ["Statement", "Conditional"],
  fields: {
    test: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    consequent: {
      validate: (0, utils.assertNodeType)("Statement")
    },
    alternate: {
      optional: true,
      validate: (0, utils.assertNodeType)("Statement")
    }
  }
});
defineType("LabeledStatement", {
  visitor: ["label", "body"],
  aliases: ["Statement"],
  fields: {
    label: {
      validate: (0, utils.assertNodeType)("Identifier")
    },
    body: {
      validate: (0, utils.assertNodeType)("Statement")
    }
  }
});
defineType("StringLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: (0, utils.assertValueType)("string")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType("NumericLiteral", {
  builder: ["value"],
  deprecatedAlias: "NumberLiteral",
  fields: {
    value: {
      validate: (0, utils.chain)((0, utils.assertValueType)("number"), Object.assign(function (node, key, val) {
      }, {
        type: "number"
      }))
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType("NullLiteral", {
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType("BooleanLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: (0, utils.assertValueType)("boolean")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType("RegExpLiteral", {
  builder: ["pattern", "flags"],
  deprecatedAlias: "RegexLiteral",
  aliases: ["Expression", "Pureish", "Literal"],
  fields: {
    pattern: {
      validate: (0, utils.assertValueType)("string")
    },
    flags: {
      validate: (0, utils.chain)((0, utils.assertValueType)("string"), Object.assign(function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;
        const invalid = /[^gimsuy]/.exec(val);
        if (invalid) {
          throw new TypeError(`"${invalid[0]}" is not a valid RegExp flag`);
        }
      }, {
        type: "string"
      })),
      default: ""
    }
  }
});
defineType("LogicalExpression", {
  builder: ["operator", "left", "right"],
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"],
  fields: {
    operator: {
      validate: (0, utils.assertOneOf)(...constants$1.LOGICAL_OPERATORS)
    },
    left: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    right: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  }
});
defineType("MemberExpression", {
  builder: ["object", "property", "computed", ...(!process.env.BABEL_TYPES_8_BREAKING ? ["optional"] : [])],
  visitor: ["object", "property"],
  aliases: ["Expression", "LVal"],
  fields: Object.assign({
    object: {
      validate: (0, utils.assertNodeType)("Expression", "Super")
    },
    property: {
      validate: function () {
        const normal = (0, utils.assertNodeType)("Identifier", "PrivateName");
        const computed = (0, utils.assertNodeType)("Expression");
        const validator = function (node, key, val) {
          const validator = node.computed ? computed : normal;
          validator(node, key, val);
        };
        validator.oneOfNodeTypes = ["Expression", "Identifier", "PrivateName"];
        return validator;
      }()
    },
    computed: {
      default: false
    }
  }, !process.env.BABEL_TYPES_8_BREAKING ? {
    optional: {
      validate: (0, utils.assertOneOf)(true, false),
      optional: true
    }
  } : {})
});
defineType("NewExpression", {
  inherits: "CallExpression"
});
defineType("Program", {
  visitor: ["directives", "body"],
  builder: ["body", "directives", "sourceType", "interpreter"],
  fields: {
    sourceType: {
      validate: (0, utils.assertOneOf)("script", "module"),
      default: "script"
    },
    interpreter: {
      validate: (0, utils.assertNodeType)("InterpreterDirective"),
      default: null,
      optional: true
    },
    directives: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Directive"))),
      default: []
    },
    body: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Statement")))
    }
  },
  aliases: ["Scopable", "BlockParent", "Block"]
});
defineType("ObjectExpression", {
  visitor: ["properties"],
  aliases: ["Expression"],
  fields: {
    properties: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("ObjectMethod", "ObjectProperty", "SpreadElement")))
    }
  }
});
defineType("ObjectMethod", {
  builder: ["kind", "key", "params", "body", "computed", "generator", "async"],
  fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
    kind: Object.assign({
      validate: (0, utils.assertOneOf)("method", "get", "set")
    }, !process.env.BABEL_TYPES_8_BREAKING ? {
      default: "method"
    } : {}),
    computed: {
      default: false
    },
    key: {
      validate: function () {
        const normal = (0, utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral");
        const computed = (0, utils.assertNodeType)("Expression");
        const validator = function (node, key, val) {
          const validator = node.computed ? computed : normal;
          validator(node, key, val);
        };
        validator.oneOfNodeTypes = ["Expression", "Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral"];
        return validator;
      }()
    },
    decorators: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Decorator"))),
      optional: true
    },
    body: {
      validate: (0, utils.assertNodeType)("BlockStatement")
    }
  }),
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  aliases: ["UserWhitespacable", "Function", "Scopable", "BlockParent", "FunctionParent", "Method", "ObjectMember"]
});
defineType("ObjectProperty", {
  builder: ["key", "value", "computed", "shorthand", ...(!process.env.BABEL_TYPES_8_BREAKING ? ["decorators"] : [])],
  fields: {
    computed: {
      default: false
    },
    key: {
      validate: function () {
        const normal = (0, utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "DecimalLiteral", "PrivateName");
        const computed = (0, utils.assertNodeType)("Expression");
        const validator = Object.assign(function (node, key, val) {
          const validator = node.computed ? computed : normal;
          validator(node, key, val);
        }, {
          oneOfNodeTypes: ["Expression", "Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "DecimalLiteral", "PrivateName"]
        });
        return validator;
      }()
    },
    value: {
      validate: (0, utils.assertNodeType)("Expression", "PatternLike")
    },
    shorthand: {
      validate: (0, utils.chain)((0, utils.assertValueType)("boolean"), Object.assign(function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;
        if (val && node.computed) {
          throw new TypeError("Property shorthand of ObjectProperty cannot be true if computed is true");
        }
      }, {
        type: "boolean"
      }), function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;
        if (val && !(0, is_1.default)("Identifier", node.key)) {
          throw new TypeError("Property shorthand of ObjectProperty cannot be true if key is not an Identifier");
        }
      }),
      default: false
    },
    decorators: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Decorator"))),
      optional: true
    }
  },
  visitor: ["key", "value", "decorators"],
  aliases: ["UserWhitespacable", "Property", "ObjectMember"],
  validate: function () {
    const pattern = (0, utils.assertNodeType)("Identifier", "Pattern", "TSAsExpression", "TSSatisfiesExpression", "TSNonNullExpression", "TSTypeAssertion");
    const expression = (0, utils.assertNodeType)("Expression");
    return function (parent, key, node) {
      if (!process.env.BABEL_TYPES_8_BREAKING) return;
      const validator = (0, is_1.default)("ObjectPattern", parent) ? pattern : expression;
      validator(node, "value", node.value);
    };
  }()
});
defineType("RestElement", {
  visitor: ["argument", "typeAnnotation"],
  builder: ["argument"],
  aliases: ["LVal", "PatternLike"],
  deprecatedAlias: "RestProperty",
  fields: Object.assign({}, patternLikeCommon(), {
    argument: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, utils.assertNodeType)("LVal") : (0, utils.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern", "MemberExpression", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression")
    }
  }),
  validate(parent, key) {
    if (!process.env.BABEL_TYPES_8_BREAKING) return;
    const match = /(\w+)\[(\d+)\]/.exec(key);
    if (!match) throw new Error("Internal Babel error: malformed key.");
    const [, listKey, index] = match;
    if (parent[listKey].length > +index + 1) {
      throw new TypeError(`RestElement must be last element of ${listKey}`);
    }
  }
});
defineType("ReturnStatement", {
  visitor: ["argument"],
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
  fields: {
    argument: {
      validate: (0, utils.assertNodeType)("Expression"),
      optional: true
    }
  }
});
defineType("SequenceExpression", {
  visitor: ["expressions"],
  fields: {
    expressions: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Expression")))
    }
  },
  aliases: ["Expression"]
});
defineType("ParenthesizedExpression", {
  visitor: ["expression"],
  aliases: ["Expression", "ExpressionWrapper"],
  fields: {
    expression: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  }
});
defineType("SwitchCase", {
  visitor: ["test", "consequent"],
  fields: {
    test: {
      validate: (0, utils.assertNodeType)("Expression"),
      optional: true
    },
    consequent: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Statement")))
    }
  }
});
defineType("SwitchStatement", {
  visitor: ["discriminant", "cases"],
  aliases: ["Statement", "BlockParent", "Scopable"],
  fields: {
    discriminant: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    cases: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("SwitchCase")))
    }
  }
});
defineType("ThisExpression", {
  aliases: ["Expression"]
});
defineType("ThrowStatement", {
  visitor: ["argument"],
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
  fields: {
    argument: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  }
});
defineType("TryStatement", {
  visitor: ["block", "handler", "finalizer"],
  aliases: ["Statement"],
  fields: {
    block: {
      validate: (0, utils.chain)((0, utils.assertNodeType)("BlockStatement"), Object.assign(function (node) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;
        if (!node.handler && !node.finalizer) {
          throw new TypeError("TryStatement expects either a handler or finalizer, or both");
        }
      }, {
        oneOfNodeTypes: ["BlockStatement"]
      }))
    },
    handler: {
      optional: true,
      validate: (0, utils.assertNodeType)("CatchClause")
    },
    finalizer: {
      optional: true,
      validate: (0, utils.assertNodeType)("BlockStatement")
    }
  }
});
defineType("UnaryExpression", {
  builder: ["operator", "argument", "prefix"],
  fields: {
    prefix: {
      default: true
    },
    argument: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    operator: {
      validate: (0, utils.assertOneOf)(...constants$1.UNARY_OPERATORS)
    }
  },
  visitor: ["argument"],
  aliases: ["UnaryLike", "Expression"]
});
defineType("UpdateExpression", {
  builder: ["operator", "argument", "prefix"],
  fields: {
    prefix: {
      default: false
    },
    argument: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, utils.assertNodeType)("Expression") : (0, utils.assertNodeType)("Identifier", "MemberExpression")
    },
    operator: {
      validate: (0, utils.assertOneOf)(...constants$1.UPDATE_OPERATORS)
    }
  },
  visitor: ["argument"],
  aliases: ["Expression"]
});
defineType("VariableDeclaration", {
  builder: ["kind", "declarations"],
  visitor: ["declarations"],
  aliases: ["Statement", "Declaration"],
  fields: {
    declare: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    kind: {
      validate: (0, utils.assertOneOf)("var", "let", "const", "using", "await using")
    },
    declarations: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("VariableDeclarator")))
    }
  },
  validate(parent, key, node) {
    if (!process.env.BABEL_TYPES_8_BREAKING) return;
    if (!(0, is_1.default)("ForXStatement", parent, {
      left: node
    })) return;
    if (node.declarations.length !== 1) {
      throw new TypeError(`Exactly one VariableDeclarator is required in the VariableDeclaration of a ${parent.type}`);
    }
  }
});
defineType("VariableDeclarator", {
  visitor: ["id", "init"],
  fields: {
    id: {
      validate: function () {
        if (!process.env.BABEL_TYPES_8_BREAKING) {
          return (0, utils.assertNodeType)("LVal");
        }
        const normal = (0, utils.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern");
        const without = (0, utils.assertNodeType)("Identifier");
        return function (node, key, val) {
          const validator = node.init ? normal : without;
          validator(node, key, val);
        };
      }()
    },
    definite: {
      optional: true,
      validate: (0, utils.assertValueType)("boolean")
    },
    init: {
      optional: true,
      validate: (0, utils.assertNodeType)("Expression")
    }
  }
});
defineType("WhileStatement", {
  visitor: ["test", "body"],
  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"],
  fields: {
    test: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    body: {
      validate: (0, utils.assertNodeType)("Statement")
    }
  }
});
defineType("WithStatement", {
  visitor: ["object", "body"],
  aliases: ["Statement"],
  fields: {
    object: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    body: {
      validate: (0, utils.assertNodeType)("Statement")
    }
  }
});
defineType("AssignmentPattern", {
  visitor: ["left", "right", "decorators"],
  builder: ["left", "right"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: Object.assign({}, patternLikeCommon(), {
    left: {
      validate: (0, utils.assertNodeType)("Identifier", "ObjectPattern", "ArrayPattern", "MemberExpression", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression")
    },
    right: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    decorators: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Decorator"))),
      optional: true
    }
  })
});
defineType("ArrayPattern", {
  visitor: ["elements", "typeAnnotation"],
  builder: ["elements"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: Object.assign({}, patternLikeCommon(), {
    elements: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeOrValueType)("null", "PatternLike", "LVal")))
    }
  })
});
defineType("ArrowFunctionExpression", {
  builder: ["params", "body", "async"],
  visitor: ["params", "body", "returnType", "typeParameters"],
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Expression", "Pureish"],
  fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
    expression: {
      validate: (0, utils.assertValueType)("boolean")
    },
    body: {
      validate: (0, utils.assertNodeType)("BlockStatement", "Expression")
    },
    predicate: {
      validate: (0, utils.assertNodeType)("DeclaredPredicate", "InferredPredicate"),
      optional: true
    }
  })
});
defineType("ClassBody", {
  visitor: ["body"],
  fields: {
    body: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("ClassMethod", "ClassPrivateMethod", "ClassProperty", "ClassPrivateProperty", "ClassAccessorProperty", "TSDeclareMethod", "TSIndexSignature", "StaticBlock")))
    }
  }
});
defineType("ClassExpression", {
  builder: ["id", "superClass", "body", "decorators"],
  visitor: ["id", "body", "superClass", "mixins", "typeParameters", "superTypeParameters", "implements", "decorators"],
  aliases: ["Scopable", "Class", "Expression"],
  fields: {
    id: {
      validate: (0, utils.assertNodeType)("Identifier"),
      optional: true
    },
    typeParameters: {
      validate: (0, utils.assertNodeType)("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
      optional: true
    },
    body: {
      validate: (0, utils.assertNodeType)("ClassBody")
    },
    superClass: {
      optional: true,
      validate: (0, utils.assertNodeType)("Expression")
    },
    superTypeParameters: {
      validate: (0, utils.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
      optional: true
    },
    implements: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("TSExpressionWithTypeArguments", "ClassImplements"))),
      optional: true
    },
    decorators: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Decorator"))),
      optional: true
    },
    mixins: {
      validate: (0, utils.assertNodeType)("InterfaceExtends"),
      optional: true
    }
  }
});
defineType("ClassDeclaration", {
  inherits: "ClassExpression",
  aliases: ["Scopable", "Class", "Statement", "Declaration"],
  fields: {
    id: {
      validate: (0, utils.assertNodeType)("Identifier"),
      optional: true
    },
    typeParameters: {
      validate: (0, utils.assertNodeType)("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
      optional: true
    },
    body: {
      validate: (0, utils.assertNodeType)("ClassBody")
    },
    superClass: {
      optional: true,
      validate: (0, utils.assertNodeType)("Expression")
    },
    superTypeParameters: {
      validate: (0, utils.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
      optional: true
    },
    implements: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("TSExpressionWithTypeArguments", "ClassImplements"))),
      optional: true
    },
    decorators: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Decorator"))),
      optional: true
    },
    mixins: {
      validate: (0, utils.assertNodeType)("InterfaceExtends"),
      optional: true
    },
    declare: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    abstract: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    }
  },
  validate: function () {
    const identifier = (0, utils.assertNodeType)("Identifier");
    return function (parent, key, node) {
      if (!process.env.BABEL_TYPES_8_BREAKING) return;
      if (!(0, is_1.default)("ExportDefaultDeclaration", parent)) {
        identifier(node, "id", node.id);
      }
    };
  }()
});
defineType("ExportAllDeclaration", {
  builder: ["source"],
  visitor: ["source", "attributes", "assertions"],
  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration", "ExportDeclaration"],
  fields: {
    source: {
      validate: (0, utils.assertNodeType)("StringLiteral")
    },
    exportKind: (0, utils.validateOptional)((0, utils.assertOneOf)("type", "value")),
    attributes: {
      optional: true,
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("ImportAttribute")))
    },
    assertions: {
      optional: true,
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("ImportAttribute")))
    }
  }
});
defineType("ExportDefaultDeclaration", {
  visitor: ["declaration"],
  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration", "ExportDeclaration"],
  fields: {
    declaration: {
      validate: (0, utils.assertNodeType)("TSDeclareFunction", "FunctionDeclaration", "ClassDeclaration", "Expression")
    },
    exportKind: (0, utils.validateOptional)((0, utils.assertOneOf)("value"))
  }
});
defineType("ExportNamedDeclaration", {
  builder: ["declaration", "specifiers", "source"],
  visitor: ["declaration", "specifiers", "source", "attributes", "assertions"],
  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration", "ExportDeclaration"],
  fields: {
    declaration: {
      optional: true,
      validate: (0, utils.chain)((0, utils.assertNodeType)("Declaration"), Object.assign(function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;
        if (val && node.specifiers.length) {
          throw new TypeError("Only declaration or specifiers is allowed on ExportNamedDeclaration");
        }
      }, {
        oneOfNodeTypes: ["Declaration"]
      }), function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;
        if (val && node.source) {
          throw new TypeError("Cannot export a declaration from a source");
        }
      })
    },
    attributes: {
      optional: true,
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("ImportAttribute")))
    },
    assertions: {
      optional: true,
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("ImportAttribute")))
    },
    specifiers: {
      default: [],
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)(function () {
        const sourced = (0, utils.assertNodeType)("ExportSpecifier", "ExportDefaultSpecifier", "ExportNamespaceSpecifier");
        const sourceless = (0, utils.assertNodeType)("ExportSpecifier");
        if (!process.env.BABEL_TYPES_8_BREAKING) return sourced;
        return function (node, key, val) {
          const validator = node.source ? sourced : sourceless;
          validator(node, key, val);
        };
      }()))
    },
    source: {
      validate: (0, utils.assertNodeType)("StringLiteral"),
      optional: true
    },
    exportKind: (0, utils.validateOptional)((0, utils.assertOneOf)("type", "value"))
  }
});
defineType("ExportSpecifier", {
  visitor: ["local", "exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: (0, utils.assertNodeType)("Identifier")
    },
    exported: {
      validate: (0, utils.assertNodeType)("Identifier", "StringLiteral")
    },
    exportKind: {
      validate: (0, utils.assertOneOf)("type", "value"),
      optional: true
    }
  }
});
defineType("ForOfStatement", {
  visitor: ["left", "right", "body"],
  builder: ["left", "right", "body", "await"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop", "ForXStatement"],
  fields: {
    left: {
      validate: function () {
        if (!process.env.BABEL_TYPES_8_BREAKING) {
          return (0, utils.assertNodeType)("VariableDeclaration", "LVal");
        }
        const declaration = (0, utils.assertNodeType)("VariableDeclaration");
        const lval = (0, utils.assertNodeType)("Identifier", "MemberExpression", "ArrayPattern", "ObjectPattern", "TSAsExpression", "TSSatisfiesExpression", "TSTypeAssertion", "TSNonNullExpression");
        return function (node, key, val) {
          if ((0, is_1.default)("VariableDeclaration", val)) {
            declaration(node, key, val);
          } else {
            lval(node, key, val);
          }
        };
      }()
    },
    right: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    body: {
      validate: (0, utils.assertNodeType)("Statement")
    },
    await: {
      default: false
    }
  }
});
defineType("ImportDeclaration", {
  builder: ["specifiers", "source"],
  visitor: ["specifiers", "source", "attributes", "assertions"],
  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration"],
  fields: {
    attributes: {
      optional: true,
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("ImportAttribute")))
    },
    assertions: {
      optional: true,
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("ImportAttribute")))
    },
    module: {
      optional: true,
      validate: (0, utils.assertValueType)("boolean")
    },
    phase: {
      default: null,
      validate: (0, utils.assertOneOf)("source", "defer")
    },
    specifiers: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("ImportSpecifier", "ImportDefaultSpecifier", "ImportNamespaceSpecifier")))
    },
    source: {
      validate: (0, utils.assertNodeType)("StringLiteral")
    },
    importKind: {
      validate: (0, utils.assertOneOf)("type", "typeof", "value"),
      optional: true
    }
  }
});
defineType("ImportDefaultSpecifier", {
  visitor: ["local"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: (0, utils.assertNodeType)("Identifier")
    }
  }
});
defineType("ImportNamespaceSpecifier", {
  visitor: ["local"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: (0, utils.assertNodeType)("Identifier")
    }
  }
});
defineType("ImportSpecifier", {
  visitor: ["local", "imported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: (0, utils.assertNodeType)("Identifier")
    },
    imported: {
      validate: (0, utils.assertNodeType)("Identifier", "StringLiteral")
    },
    importKind: {
      validate: (0, utils.assertOneOf)("type", "typeof", "value"),
      optional: true
    }
  }
});
defineType("ImportExpression", {
  visitor: ["source", "options"],
  aliases: ["Expression"],
  fields: {
    phase: {
      default: null,
      validate: (0, utils.assertOneOf)("source", "defer")
    },
    source: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    options: {
      validate: (0, utils.assertNodeType)("Expression"),
      optional: true
    }
  }
});
defineType("MetaProperty", {
  visitor: ["meta", "property"],
  aliases: ["Expression"],
  fields: {
    meta: {
      validate: (0, utils.chain)((0, utils.assertNodeType)("Identifier"), Object.assign(function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;
        let property;
        switch (val.name) {
          case "function":
            property = "sent";
            break;
          case "new":
            property = "target";
            break;
          case "import":
            property = "meta";
            break;
        }
        if (!(0, is_1.default)("Identifier", node.property, {
          name: property
        })) {
          throw new TypeError("Unrecognised MetaProperty");
        }
      }, {
        oneOfNodeTypes: ["Identifier"]
      }))
    },
    property: {
      validate: (0, utils.assertNodeType)("Identifier")
    }
  }
});
const classMethodOrPropertyCommon = () => ({
  abstract: {
    validate: (0, utils.assertValueType)("boolean"),
    optional: true
  },
  accessibility: {
    validate: (0, utils.assertOneOf)("public", "private", "protected"),
    optional: true
  },
  static: {
    default: false
  },
  override: {
    default: false
  },
  computed: {
    default: false
  },
  optional: {
    validate: (0, utils.assertValueType)("boolean"),
    optional: true
  },
  key: {
    validate: (0, utils.chain)(function () {
      const normal = (0, utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral");
      const computed = (0, utils.assertNodeType)("Expression");
      return function (node, key, val) {
        const validator = node.computed ? computed : normal;
        validator(node, key, val);
      };
    }(), (0, utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "Expression"))
  }
});
exports.classMethodOrPropertyCommon = classMethodOrPropertyCommon;
const classMethodOrDeclareMethodCommon = () => Object.assign({}, functionCommon(), classMethodOrPropertyCommon(), {
  params: {
    validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Identifier", "Pattern", "RestElement", "TSParameterProperty")))
  },
  kind: {
    validate: (0, utils.assertOneOf)("get", "set", "method", "constructor"),
    default: "method"
  },
  access: {
    validate: (0, utils.chain)((0, utils.assertValueType)("string"), (0, utils.assertOneOf)("public", "private", "protected")),
    optional: true
  },
  decorators: {
    validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Decorator"))),
    optional: true
  }
});
exports.classMethodOrDeclareMethodCommon = classMethodOrDeclareMethodCommon;
defineType("ClassMethod", {
  aliases: ["Function", "Scopable", "BlockParent", "FunctionParent", "Method"],
  builder: ["kind", "key", "params", "body", "computed", "static", "generator", "async"],
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  fields: Object.assign({}, classMethodOrDeclareMethodCommon(), functionTypeAnnotationCommon(), {
    body: {
      validate: (0, utils.assertNodeType)("BlockStatement")
    }
  })
});
defineType("ObjectPattern", {
  visitor: ["properties", "typeAnnotation", "decorators"],
  builder: ["properties"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: Object.assign({}, patternLikeCommon(), {
    properties: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("RestElement", "ObjectProperty")))
    }
  })
});
defineType("SpreadElement", {
  visitor: ["argument"],
  aliases: ["UnaryLike"],
  deprecatedAlias: "SpreadProperty",
  fields: {
    argument: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  }
});
defineType("Super", {
  aliases: ["Expression"]
});
defineType("TaggedTemplateExpression", {
  visitor: ["tag", "quasi", "typeParameters"],
  builder: ["tag", "quasi"],
  aliases: ["Expression"],
  fields: {
    tag: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    quasi: {
      validate: (0, utils.assertNodeType)("TemplateLiteral")
    },
    typeParameters: {
      validate: (0, utils.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
      optional: true
    }
  }
});
defineType("TemplateElement", {
  builder: ["value", "tail"],
  fields: {
    value: {
      validate: (0, utils.chain)((0, utils.assertShape)({
        raw: {
          validate: (0, utils.assertValueType)("string")
        },
        cooked: {
          validate: (0, utils.assertValueType)("string"),
          optional: true
        }
      }), function templateElementCookedValidator(node) {
        const raw = node.value.raw;
        let unterminatedCalled = false;
        const error = () => {
          throw new Error("Internal @babel/types error.");
        };
        const {
          str,
          firstInvalidLoc
        } = (0, lib$1.readStringContents)("template", raw, 0, 0, 0, {
          unterminated() {
            unterminatedCalled = true;
          },
          strictNumericEscape: error,
          invalidEscapeSequence: error,
          numericSeparatorInEscapeSequence: error,
          unexpectedNumericSeparator: error,
          invalidDigit: error,
          invalidCodePoint: error
        });
        if (!unterminatedCalled) throw new Error("Invalid raw");
        node.value.cooked = firstInvalidLoc ? null : str;
      })
    },
    tail: {
      default: false
    }
  }
});
defineType("TemplateLiteral", {
  visitor: ["quasis", "expressions"],
  aliases: ["Expression", "Literal"],
  fields: {
    quasis: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("TemplateElement")))
    },
    expressions: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Expression", "TSType")), function (node, key, val) {
        if (node.quasis.length !== val.length + 1) {
          throw new TypeError(`Number of ${node.type} quasis should be exactly one more than the number of expressions.\nExpected ${val.length + 1} quasis but got ${node.quasis.length}`);
        }
      })
    }
  }
});
defineType("YieldExpression", {
  builder: ["argument", "delegate"],
  visitor: ["argument"],
  aliases: ["Expression", "Terminatorless"],
  fields: {
    delegate: {
      validate: (0, utils.chain)((0, utils.assertValueType)("boolean"), Object.assign(function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;
        if (val && !node.argument) {
          throw new TypeError("Property delegate of YieldExpression cannot be true if there is no argument");
        }
      }, {
        type: "boolean"
      })),
      default: false
    },
    argument: {
      optional: true,
      validate: (0, utils.assertNodeType)("Expression")
    }
  }
});
defineType("AwaitExpression", {
  builder: ["argument"],
  visitor: ["argument"],
  aliases: ["Expression", "Terminatorless"],
  fields: {
    argument: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  }
});
defineType("Import", {
  aliases: ["Expression"]
});
defineType("BigIntLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: (0, utils.assertValueType)("string")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType("ExportNamespaceSpecifier", {
  visitor: ["exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    exported: {
      validate: (0, utils.assertNodeType)("Identifier")
    }
  }
});
defineType("OptionalMemberExpression", {
  builder: ["object", "property", "computed", "optional"],
  visitor: ["object", "property"],
  aliases: ["Expression"],
  fields: {
    object: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    property: {
      validate: function () {
        const normal = (0, utils.assertNodeType)("Identifier");
        const computed = (0, utils.assertNodeType)("Expression");
        const validator = Object.assign(function (node, key, val) {
          const validator = node.computed ? computed : normal;
          validator(node, key, val);
        }, {
          oneOfNodeTypes: ["Expression", "Identifier"]
        });
        return validator;
      }()
    },
    computed: {
      default: false
    },
    optional: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, utils.assertValueType)("boolean") : (0, utils.chain)((0, utils.assertValueType)("boolean"), (0, utils.assertOptionalChainStart)())
    }
  }
});
defineType("OptionalCallExpression", {
  visitor: ["callee", "arguments", "typeParameters", "typeArguments"],
  builder: ["callee", "arguments", "optional"],
  aliases: ["Expression"],
  fields: {
    callee: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    arguments: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Expression", "SpreadElement", "JSXNamespacedName", "ArgumentPlaceholder")))
    },
    optional: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, utils.assertValueType)("boolean") : (0, utils.chain)((0, utils.assertValueType)("boolean"), (0, utils.assertOptionalChainStart)())
    },
    typeArguments: {
      validate: (0, utils.assertNodeType)("TypeParameterInstantiation"),
      optional: true
    },
    typeParameters: {
      validate: (0, utils.assertNodeType)("TSTypeParameterInstantiation"),
      optional: true
    }
  }
});
defineType("ClassProperty", {
  visitor: ["key", "value", "typeAnnotation", "decorators"],
  builder: ["key", "value", "typeAnnotation", "decorators", "computed", "static"],
  aliases: ["Property"],
  fields: Object.assign({}, classMethodOrPropertyCommon(), {
    value: {
      validate: (0, utils.assertNodeType)("Expression"),
      optional: true
    },
    definite: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    typeAnnotation: {
      validate: (0, utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
      optional: true
    },
    decorators: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Decorator"))),
      optional: true
    },
    readonly: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    declare: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    variance: {
      validate: (0, utils.assertNodeType)("Variance"),
      optional: true
    }
  })
});
defineType("ClassAccessorProperty", {
  visitor: ["key", "value", "typeAnnotation", "decorators"],
  builder: ["key", "value", "typeAnnotation", "decorators", "computed", "static"],
  aliases: ["Property", "Accessor"],
  fields: Object.assign({}, classMethodOrPropertyCommon(), {
    key: {
      validate: (0, utils.chain)(function () {
        const normal = (0, utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "PrivateName");
        const computed = (0, utils.assertNodeType)("Expression");
        return function (node, key, val) {
          const validator = node.computed ? computed : normal;
          validator(node, key, val);
        };
      }(), (0, utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "Expression", "PrivateName"))
    },
    value: {
      validate: (0, utils.assertNodeType)("Expression"),
      optional: true
    },
    definite: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    typeAnnotation: {
      validate: (0, utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
      optional: true
    },
    decorators: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Decorator"))),
      optional: true
    },
    readonly: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    declare: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    variance: {
      validate: (0, utils.assertNodeType)("Variance"),
      optional: true
    }
  })
});
defineType("ClassPrivateProperty", {
  visitor: ["key", "value", "decorators", "typeAnnotation"],
  builder: ["key", "value", "decorators", "static"],
  aliases: ["Property", "Private"],
  fields: {
    key: {
      validate: (0, utils.assertNodeType)("PrivateName")
    },
    value: {
      validate: (0, utils.assertNodeType)("Expression"),
      optional: true
    },
    typeAnnotation: {
      validate: (0, utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
      optional: true
    },
    decorators: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Decorator"))),
      optional: true
    },
    static: {
      validate: (0, utils.assertValueType)("boolean"),
      default: false
    },
    readonly: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    definite: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    variance: {
      validate: (0, utils.assertNodeType)("Variance"),
      optional: true
    }
  }
});
defineType("ClassPrivateMethod", {
  builder: ["kind", "key", "params", "body", "static"],
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  aliases: ["Function", "Scopable", "BlockParent", "FunctionParent", "Method", "Private"],
  fields: Object.assign({}, classMethodOrDeclareMethodCommon(), functionTypeAnnotationCommon(), {
    kind: {
      validate: (0, utils.assertOneOf)("get", "set", "method"),
      default: "method"
    },
    key: {
      validate: (0, utils.assertNodeType)("PrivateName")
    },
    body: {
      validate: (0, utils.assertNodeType)("BlockStatement")
    }
  })
});
defineType("PrivateName", {
  visitor: ["id"],
  aliases: ["Private"],
  fields: {
    id: {
      validate: (0, utils.assertNodeType)("Identifier")
    }
  }
});
defineType("StaticBlock", {
  visitor: ["body"],
  fields: {
    body: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Statement")))
    }
  },
  aliases: ["Scopable", "BlockParent", "FunctionParent"]
});


});

unwrapExports(core);
core.patternLikeCommon;
core.functionTypeAnnotationCommon;
core.functionDeclarationCommon;
core.functionCommon;
core.classMethodOrPropertyCommon;
core.classMethodOrDeclareMethodCommon;

const defineType$3 = (0, utils.defineAliasedType)("Flow");
const defineInterfaceishType = name => {
  const isDeclareClass = name === "DeclareClass";
  defineType$3(name, {
    builder: ["id", "typeParameters", "extends", "body"],
    visitor: ["id", "typeParameters", "extends", ...(isDeclareClass ? ["mixins", "implements"] : []), "body"],
    aliases: ["FlowDeclaration", "Statement", "Declaration"],
    fields: Object.assign({
      id: (0, utils.validateType)("Identifier"),
      typeParameters: (0, utils.validateOptionalType)("TypeParameterDeclaration"),
      extends: (0, utils.validateOptional)((0, utils.arrayOfType)("InterfaceExtends"))
    }, isDeclareClass ? {
      mixins: (0, utils.validateOptional)((0, utils.arrayOfType)("InterfaceExtends")),
      implements: (0, utils.validateOptional)((0, utils.arrayOfType)("ClassImplements"))
    } : {}, {
      body: (0, utils.validateType)("ObjectTypeAnnotation")
    })
  });
};
defineType$3("AnyTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType$3("ArrayTypeAnnotation", {
  visitor: ["elementType"],
  aliases: ["FlowType"],
  fields: {
    elementType: (0, utils.validateType)("FlowType")
  }
});
defineType$3("BooleanTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType$3("BooleanLiteralTypeAnnotation", {
  builder: ["value"],
  aliases: ["FlowType"],
  fields: {
    value: (0, utils.validate)((0, utils.assertValueType)("boolean"))
  }
});
defineType$3("NullLiteralTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType$3("ClassImplements", {
  visitor: ["id", "typeParameters"],
  fields: {
    id: (0, utils.validateType)("Identifier"),
    typeParameters: (0, utils.validateOptionalType)("TypeParameterInstantiation")
  }
});
defineInterfaceishType("DeclareClass");
defineType$3("DeclareFunction", {
  visitor: ["id"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, utils.validateType)("Identifier"),
    predicate: (0, utils.validateOptionalType)("DeclaredPredicate")
  }
});
defineInterfaceishType("DeclareInterface");
defineType$3("DeclareModule", {
  builder: ["id", "body", "kind"],
  visitor: ["id", "body"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, utils.validateType)(["Identifier", "StringLiteral"]),
    body: (0, utils.validateType)("BlockStatement"),
    kind: (0, utils.validateOptional)((0, utils.assertOneOf)("CommonJS", "ES"))
  }
});
defineType$3("DeclareModuleExports", {
  visitor: ["typeAnnotation"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    typeAnnotation: (0, utils.validateType)("TypeAnnotation")
  }
});
defineType$3("DeclareTypeAlias", {
  visitor: ["id", "typeParameters", "right"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, utils.validateType)("Identifier"),
    typeParameters: (0, utils.validateOptionalType)("TypeParameterDeclaration"),
    right: (0, utils.validateType)("FlowType")
  }
});
defineType$3("DeclareOpaqueType", {
  visitor: ["id", "typeParameters", "supertype"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, utils.validateType)("Identifier"),
    typeParameters: (0, utils.validateOptionalType)("TypeParameterDeclaration"),
    supertype: (0, utils.validateOptionalType)("FlowType"),
    impltype: (0, utils.validateOptionalType)("FlowType")
  }
});
defineType$3("DeclareVariable", {
  visitor: ["id"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, utils.validateType)("Identifier")
  }
});
defineType$3("DeclareExportDeclaration", {
  visitor: ["declaration", "specifiers", "source"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    declaration: (0, utils.validateOptionalType)("Flow"),
    specifiers: (0, utils.validateOptional)((0, utils.arrayOfType)(["ExportSpecifier", "ExportNamespaceSpecifier"])),
    source: (0, utils.validateOptionalType)("StringLiteral"),
    default: (0, utils.validateOptional)((0, utils.assertValueType)("boolean"))
  }
});
defineType$3("DeclareExportAllDeclaration", {
  visitor: ["source"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    source: (0, utils.validateType)("StringLiteral"),
    exportKind: (0, utils.validateOptional)((0, utils.assertOneOf)("type", "value"))
  }
});
defineType$3("DeclaredPredicate", {
  visitor: ["value"],
  aliases: ["FlowPredicate"],
  fields: {
    value: (0, utils.validateType)("Flow")
  }
});
defineType$3("ExistsTypeAnnotation", {
  aliases: ["FlowType"]
});
defineType$3("FunctionTypeAnnotation", {
  visitor: ["typeParameters", "params", "rest", "returnType"],
  aliases: ["FlowType"],
  fields: {
    typeParameters: (0, utils.validateOptionalType)("TypeParameterDeclaration"),
    params: (0, utils.validate)((0, utils.arrayOfType)("FunctionTypeParam")),
    rest: (0, utils.validateOptionalType)("FunctionTypeParam"),
    this: (0, utils.validateOptionalType)("FunctionTypeParam"),
    returnType: (0, utils.validateType)("FlowType")
  }
});
defineType$3("FunctionTypeParam", {
  visitor: ["name", "typeAnnotation"],
  fields: {
    name: (0, utils.validateOptionalType)("Identifier"),
    typeAnnotation: (0, utils.validateType)("FlowType"),
    optional: (0, utils.validateOptional)((0, utils.assertValueType)("boolean"))
  }
});
defineType$3("GenericTypeAnnotation", {
  visitor: ["id", "typeParameters"],
  aliases: ["FlowType"],
  fields: {
    id: (0, utils.validateType)(["Identifier", "QualifiedTypeIdentifier"]),
    typeParameters: (0, utils.validateOptionalType)("TypeParameterInstantiation")
  }
});
defineType$3("InferredPredicate", {
  aliases: ["FlowPredicate"]
});
defineType$3("InterfaceExtends", {
  visitor: ["id", "typeParameters"],
  fields: {
    id: (0, utils.validateType)(["Identifier", "QualifiedTypeIdentifier"]),
    typeParameters: (0, utils.validateOptionalType)("TypeParameterInstantiation")
  }
});
defineInterfaceishType("InterfaceDeclaration");
defineType$3("InterfaceTypeAnnotation", {
  visitor: ["extends", "body"],
  aliases: ["FlowType"],
  fields: {
    extends: (0, utils.validateOptional)((0, utils.arrayOfType)("InterfaceExtends")),
    body: (0, utils.validateType)("ObjectTypeAnnotation")
  }
});
defineType$3("IntersectionTypeAnnotation", {
  visitor: ["types"],
  aliases: ["FlowType"],
  fields: {
    types: (0, utils.validate)((0, utils.arrayOfType)("FlowType"))
  }
});
defineType$3("MixedTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType$3("EmptyTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType$3("NullableTypeAnnotation", {
  visitor: ["typeAnnotation"],
  aliases: ["FlowType"],
  fields: {
    typeAnnotation: (0, utils.validateType)("FlowType")
  }
});
defineType$3("NumberLiteralTypeAnnotation", {
  builder: ["value"],
  aliases: ["FlowType"],
  fields: {
    value: (0, utils.validate)((0, utils.assertValueType)("number"))
  }
});
defineType$3("NumberTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType$3("ObjectTypeAnnotation", {
  visitor: ["properties", "indexers", "callProperties", "internalSlots"],
  aliases: ["FlowType"],
  builder: ["properties", "indexers", "callProperties", "internalSlots", "exact"],
  fields: {
    properties: (0, utils.validate)((0, utils.arrayOfType)(["ObjectTypeProperty", "ObjectTypeSpreadProperty"])),
    indexers: {
      validate: (0, utils.arrayOfType)("ObjectTypeIndexer"),
      optional: true,
      default: []
    },
    callProperties: {
      validate: (0, utils.arrayOfType)("ObjectTypeCallProperty"),
      optional: true,
      default: []
    },
    internalSlots: {
      validate: (0, utils.arrayOfType)("ObjectTypeInternalSlot"),
      optional: true,
      default: []
    },
    exact: {
      validate: (0, utils.assertValueType)("boolean"),
      default: false
    },
    inexact: (0, utils.validateOptional)((0, utils.assertValueType)("boolean"))
  }
});
defineType$3("ObjectTypeInternalSlot", {
  visitor: ["id", "value", "optional", "static", "method"],
  aliases: ["UserWhitespacable"],
  fields: {
    id: (0, utils.validateType)("Identifier"),
    value: (0, utils.validateType)("FlowType"),
    optional: (0, utils.validate)((0, utils.assertValueType)("boolean")),
    static: (0, utils.validate)((0, utils.assertValueType)("boolean")),
    method: (0, utils.validate)((0, utils.assertValueType)("boolean"))
  }
});
defineType$3("ObjectTypeCallProperty", {
  visitor: ["value"],
  aliases: ["UserWhitespacable"],
  fields: {
    value: (0, utils.validateType)("FlowType"),
    static: (0, utils.validate)((0, utils.assertValueType)("boolean"))
  }
});
defineType$3("ObjectTypeIndexer", {
  visitor: ["id", "key", "value", "variance"],
  aliases: ["UserWhitespacable"],
  fields: {
    id: (0, utils.validateOptionalType)("Identifier"),
    key: (0, utils.validateType)("FlowType"),
    value: (0, utils.validateType)("FlowType"),
    static: (0, utils.validate)((0, utils.assertValueType)("boolean")),
    variance: (0, utils.validateOptionalType)("Variance")
  }
});
defineType$3("ObjectTypeProperty", {
  visitor: ["key", "value", "variance"],
  aliases: ["UserWhitespacable"],
  fields: {
    key: (0, utils.validateType)(["Identifier", "StringLiteral"]),
    value: (0, utils.validateType)("FlowType"),
    kind: (0, utils.validate)((0, utils.assertOneOf)("init", "get", "set")),
    static: (0, utils.validate)((0, utils.assertValueType)("boolean")),
    proto: (0, utils.validate)((0, utils.assertValueType)("boolean")),
    optional: (0, utils.validate)((0, utils.assertValueType)("boolean")),
    variance: (0, utils.validateOptionalType)("Variance"),
    method: (0, utils.validate)((0, utils.assertValueType)("boolean"))
  }
});
defineType$3("ObjectTypeSpreadProperty", {
  visitor: ["argument"],
  aliases: ["UserWhitespacable"],
  fields: {
    argument: (0, utils.validateType)("FlowType")
  }
});
defineType$3("OpaqueType", {
  visitor: ["id", "typeParameters", "supertype", "impltype"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, utils.validateType)("Identifier"),
    typeParameters: (0, utils.validateOptionalType)("TypeParameterDeclaration"),
    supertype: (0, utils.validateOptionalType)("FlowType"),
    impltype: (0, utils.validateType)("FlowType")
  }
});
defineType$3("QualifiedTypeIdentifier", {
  visitor: ["id", "qualification"],
  fields: {
    id: (0, utils.validateType)("Identifier"),
    qualification: (0, utils.validateType)(["Identifier", "QualifiedTypeIdentifier"])
  }
});
defineType$3("StringLiteralTypeAnnotation", {
  builder: ["value"],
  aliases: ["FlowType"],
  fields: {
    value: (0, utils.validate)((0, utils.assertValueType)("string"))
  }
});
defineType$3("StringTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType$3("SymbolTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType$3("ThisTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType$3("TupleTypeAnnotation", {
  visitor: ["types"],
  aliases: ["FlowType"],
  fields: {
    types: (0, utils.validate)((0, utils.arrayOfType)("FlowType"))
  }
});
defineType$3("TypeofTypeAnnotation", {
  visitor: ["argument"],
  aliases: ["FlowType"],
  fields: {
    argument: (0, utils.validateType)("FlowType")
  }
});
defineType$3("TypeAlias", {
  visitor: ["id", "typeParameters", "right"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, utils.validateType)("Identifier"),
    typeParameters: (0, utils.validateOptionalType)("TypeParameterDeclaration"),
    right: (0, utils.validateType)("FlowType")
  }
});
defineType$3("TypeAnnotation", {
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: (0, utils.validateType)("FlowType")
  }
});
defineType$3("TypeCastExpression", {
  visitor: ["expression", "typeAnnotation"],
  aliases: ["ExpressionWrapper", "Expression"],
  fields: {
    expression: (0, utils.validateType)("Expression"),
    typeAnnotation: (0, utils.validateType)("TypeAnnotation")
  }
});
defineType$3("TypeParameter", {
  visitor: ["bound", "default", "variance"],
  fields: {
    name: (0, utils.validate)((0, utils.assertValueType)("string")),
    bound: (0, utils.validateOptionalType)("TypeAnnotation"),
    default: (0, utils.validateOptionalType)("FlowType"),
    variance: (0, utils.validateOptionalType)("Variance")
  }
});
defineType$3("TypeParameterDeclaration", {
  visitor: ["params"],
  fields: {
    params: (0, utils.validate)((0, utils.arrayOfType)("TypeParameter"))
  }
});
defineType$3("TypeParameterInstantiation", {
  visitor: ["params"],
  fields: {
    params: (0, utils.validate)((0, utils.arrayOfType)("FlowType"))
  }
});
defineType$3("UnionTypeAnnotation", {
  visitor: ["types"],
  aliases: ["FlowType"],
  fields: {
    types: (0, utils.validate)((0, utils.arrayOfType)("FlowType"))
  }
});
defineType$3("Variance", {
  builder: ["kind"],
  fields: {
    kind: (0, utils.validate)((0, utils.assertOneOf)("minus", "plus"))
  }
});
defineType$3("VoidTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType$3("EnumDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "body"],
  fields: {
    id: (0, utils.validateType)("Identifier"),
    body: (0, utils.validateType)(["EnumBooleanBody", "EnumNumberBody", "EnumStringBody", "EnumSymbolBody"])
  }
});
defineType$3("EnumBooleanBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    explicitType: (0, utils.validate)((0, utils.assertValueType)("boolean")),
    members: (0, utils.validateArrayOfType)("EnumBooleanMember"),
    hasUnknownMembers: (0, utils.validate)((0, utils.assertValueType)("boolean"))
  }
});
defineType$3("EnumNumberBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    explicitType: (0, utils.validate)((0, utils.assertValueType)("boolean")),
    members: (0, utils.validateArrayOfType)("EnumNumberMember"),
    hasUnknownMembers: (0, utils.validate)((0, utils.assertValueType)("boolean"))
  }
});
defineType$3("EnumStringBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    explicitType: (0, utils.validate)((0, utils.assertValueType)("boolean")),
    members: (0, utils.validateArrayOfType)(["EnumStringMember", "EnumDefaultedMember"]),
    hasUnknownMembers: (0, utils.validate)((0, utils.assertValueType)("boolean"))
  }
});
defineType$3("EnumSymbolBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    members: (0, utils.validateArrayOfType)("EnumDefaultedMember"),
    hasUnknownMembers: (0, utils.validate)((0, utils.assertValueType)("boolean"))
  }
});
defineType$3("EnumBooleanMember", {
  aliases: ["EnumMember"],
  visitor: ["id"],
  fields: {
    id: (0, utils.validateType)("Identifier"),
    init: (0, utils.validateType)("BooleanLiteral")
  }
});
defineType$3("EnumNumberMember", {
  aliases: ["EnumMember"],
  visitor: ["id", "init"],
  fields: {
    id: (0, utils.validateType)("Identifier"),
    init: (0, utils.validateType)("NumericLiteral")
  }
});
defineType$3("EnumStringMember", {
  aliases: ["EnumMember"],
  visitor: ["id", "init"],
  fields: {
    id: (0, utils.validateType)("Identifier"),
    init: (0, utils.validateType)("StringLiteral")
  }
});
defineType$3("EnumDefaultedMember", {
  aliases: ["EnumMember"],
  visitor: ["id"],
  fields: {
    id: (0, utils.validateType)("Identifier")
  }
});
defineType$3("IndexedAccessType", {
  visitor: ["objectType", "indexType"],
  aliases: ["FlowType"],
  fields: {
    objectType: (0, utils.validateType)("FlowType"),
    indexType: (0, utils.validateType)("FlowType")
  }
});
defineType$3("OptionalIndexedAccessType", {
  visitor: ["objectType", "indexType"],
  aliases: ["FlowType"],
  fields: {
    objectType: (0, utils.validateType)("FlowType"),
    indexType: (0, utils.validateType)("FlowType"),
    optional: (0, utils.validate)((0, utils.assertValueType)("boolean"))
  }
});

const defineType$2 = (0, utils.defineAliasedType)("JSX");
defineType$2("JSXAttribute", {
  visitor: ["name", "value"],
  aliases: ["Immutable"],
  fields: {
    name: {
      validate: (0, utils.assertNodeType)("JSXIdentifier", "JSXNamespacedName")
    },
    value: {
      optional: true,
      validate: (0, utils.assertNodeType)("JSXElement", "JSXFragment", "StringLiteral", "JSXExpressionContainer")
    }
  }
});
defineType$2("JSXClosingElement", {
  visitor: ["name"],
  aliases: ["Immutable"],
  fields: {
    name: {
      validate: (0, utils.assertNodeType)("JSXIdentifier", "JSXMemberExpression", "JSXNamespacedName")
    }
  }
});
defineType$2("JSXElement", {
  builder: ["openingElement", "closingElement", "children", "selfClosing"],
  visitor: ["openingElement", "children", "closingElement"],
  aliases: ["Immutable", "Expression"],
  fields: Object.assign({
    openingElement: {
      validate: (0, utils.assertNodeType)("JSXOpeningElement")
    },
    closingElement: {
      optional: true,
      validate: (0, utils.assertNodeType)("JSXClosingElement")
    },
    children: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("JSXText", "JSXExpressionContainer", "JSXSpreadChild", "JSXElement", "JSXFragment")))
    }
  }, {
    selfClosing: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    }
  })
});
defineType$2("JSXEmptyExpression", {});
defineType$2("JSXExpressionContainer", {
  visitor: ["expression"],
  aliases: ["Immutable"],
  fields: {
    expression: {
      validate: (0, utils.assertNodeType)("Expression", "JSXEmptyExpression")
    }
  }
});
defineType$2("JSXSpreadChild", {
  visitor: ["expression"],
  aliases: ["Immutable"],
  fields: {
    expression: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  }
});
defineType$2("JSXIdentifier", {
  builder: ["name"],
  fields: {
    name: {
      validate: (0, utils.assertValueType)("string")
    }
  }
});
defineType$2("JSXMemberExpression", {
  visitor: ["object", "property"],
  fields: {
    object: {
      validate: (0, utils.assertNodeType)("JSXMemberExpression", "JSXIdentifier")
    },
    property: {
      validate: (0, utils.assertNodeType)("JSXIdentifier")
    }
  }
});
defineType$2("JSXNamespacedName", {
  visitor: ["namespace", "name"],
  fields: {
    namespace: {
      validate: (0, utils.assertNodeType)("JSXIdentifier")
    },
    name: {
      validate: (0, utils.assertNodeType)("JSXIdentifier")
    }
  }
});
defineType$2("JSXOpeningElement", {
  builder: ["name", "attributes", "selfClosing"],
  visitor: ["name", "attributes"],
  aliases: ["Immutable"],
  fields: {
    name: {
      validate: (0, utils.assertNodeType)("JSXIdentifier", "JSXMemberExpression", "JSXNamespacedName")
    },
    selfClosing: {
      default: false
    },
    attributes: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("JSXAttribute", "JSXSpreadAttribute")))
    },
    typeParameters: {
      validate: (0, utils.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
      optional: true
    }
  }
});
defineType$2("JSXSpreadAttribute", {
  visitor: ["argument"],
  fields: {
    argument: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  }
});
defineType$2("JSXText", {
  aliases: ["Immutable"],
  builder: ["value"],
  fields: {
    value: {
      validate: (0, utils.assertValueType)("string")
    }
  }
});
defineType$2("JSXFragment", {
  builder: ["openingFragment", "closingFragment", "children"],
  visitor: ["openingFragment", "children", "closingFragment"],
  aliases: ["Immutable", "Expression"],
  fields: {
    openingFragment: {
      validate: (0, utils.assertNodeType)("JSXOpeningFragment")
    },
    closingFragment: {
      validate: (0, utils.assertNodeType)("JSXClosingFragment")
    },
    children: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("JSXText", "JSXExpressionContainer", "JSXSpreadChild", "JSXElement", "JSXFragment")))
    }
  }
});
defineType$2("JSXOpeningFragment", {
  aliases: ["Immutable"]
});
defineType$2("JSXClosingFragment", {
  aliases: ["Immutable"]
});

var placeholders = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PLACEHOLDERS_FLIPPED_ALIAS = exports.PLACEHOLDERS_ALIAS = exports.PLACEHOLDERS = void 0;

const PLACEHOLDERS = exports.PLACEHOLDERS = ["Identifier", "StringLiteral", "Expression", "Statement", "Declaration", "BlockStatement", "ClassBody", "Pattern"];
const PLACEHOLDERS_ALIAS = exports.PLACEHOLDERS_ALIAS = {
  Declaration: ["Statement"],
  Pattern: ["PatternLike", "LVal"]
};
for (const type of PLACEHOLDERS) {
  const alias = utils.ALIAS_KEYS[type];
  if (alias != null && alias.length) PLACEHOLDERS_ALIAS[type] = alias;
}
const PLACEHOLDERS_FLIPPED_ALIAS = exports.PLACEHOLDERS_FLIPPED_ALIAS = {};
Object.keys(PLACEHOLDERS_ALIAS).forEach(type => {
  PLACEHOLDERS_ALIAS[type].forEach(alias => {
    if (!hasOwnProperty.call(PLACEHOLDERS_FLIPPED_ALIAS, alias)) {
      PLACEHOLDERS_FLIPPED_ALIAS[alias] = [];
    }
    PLACEHOLDERS_FLIPPED_ALIAS[alias].push(type);
  });
});


});

unwrapExports(placeholders);
placeholders.PLACEHOLDERS_FLIPPED_ALIAS;
placeholders.PLACEHOLDERS_ALIAS;
placeholders.PLACEHOLDERS;

const defineType$1 = (0, utils.defineAliasedType)("Miscellaneous");
{
  defineType$1("Noop", {
    visitor: []
  });
}
defineType$1("Placeholder", {
  visitor: [],
  builder: ["expectedNode", "name"],
  fields: {
    name: {
      validate: (0, utils.assertNodeType)("Identifier")
    },
    expectedNode: {
      validate: (0, utils.assertOneOf)(...placeholders.PLACEHOLDERS)
    }
  }
});
defineType$1("V8IntrinsicIdentifier", {
  builder: ["name"],
  fields: {
    name: {
      validate: (0, utils.assertValueType)("string")
    }
  }
});

(0, utils.default)("ArgumentPlaceholder", {});
(0, utils.default)("BindExpression", {
  visitor: ["object", "callee"],
  aliases: ["Expression"],
  fields: !process.env.BABEL_TYPES_8_BREAKING ? {
    object: {
      validate: Object.assign(() => {}, {
        oneOfNodeTypes: ["Expression"]
      })
    },
    callee: {
      validate: Object.assign(() => {}, {
        oneOfNodeTypes: ["Expression"]
      })
    }
  } : {
    object: {
      validate: (0, utils.assertNodeType)("Expression")
    },
    callee: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  }
});
(0, utils.default)("ImportAttribute", {
  visitor: ["key", "value"],
  fields: {
    key: {
      validate: (0, utils.assertNodeType)("Identifier", "StringLiteral")
    },
    value: {
      validate: (0, utils.assertNodeType)("StringLiteral")
    }
  }
});
(0, utils.default)("Decorator", {
  visitor: ["expression"],
  fields: {
    expression: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  }
});
(0, utils.default)("DoExpression", {
  visitor: ["body"],
  builder: ["body", "async"],
  aliases: ["Expression"],
  fields: {
    body: {
      validate: (0, utils.assertNodeType)("BlockStatement")
    },
    async: {
      validate: (0, utils.assertValueType)("boolean"),
      default: false
    }
  }
});
(0, utils.default)("ExportDefaultSpecifier", {
  visitor: ["exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    exported: {
      validate: (0, utils.assertNodeType)("Identifier")
    }
  }
});
(0, utils.default)("RecordExpression", {
  visitor: ["properties"],
  aliases: ["Expression"],
  fields: {
    properties: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("ObjectProperty", "SpreadElement")))
    }
  }
});
(0, utils.default)("TupleExpression", {
  fields: {
    elements: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Expression", "SpreadElement"))),
      default: []
    }
  },
  visitor: ["elements"],
  aliases: ["Expression"]
});
(0, utils.default)("DecimalLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: (0, utils.assertValueType)("string")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
(0, utils.default)("ModuleExpression", {
  visitor: ["body"],
  fields: {
    body: {
      validate: (0, utils.assertNodeType)("Program")
    }
  },
  aliases: ["Expression"]
});
(0, utils.default)("TopicReference", {
  aliases: ["Expression"]
});
(0, utils.default)("PipelineTopicExpression", {
  builder: ["expression"],
  visitor: ["expression"],
  fields: {
    expression: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  },
  aliases: ["Expression"]
});
(0, utils.default)("PipelineBareFunction", {
  builder: ["callee"],
  visitor: ["callee"],
  fields: {
    callee: {
      validate: (0, utils.assertNodeType)("Expression")
    }
  },
  aliases: ["Expression"]
});
(0, utils.default)("PipelinePrimaryTopicReference", {
  aliases: ["Expression"]
});

const defineType = (0, utils.defineAliasedType)("TypeScript");
const bool = (0, utils.assertValueType)("boolean");
const tSFunctionTypeAnnotationCommon = () => ({
  returnType: {
    validate: (0, utils.assertNodeType)("TSTypeAnnotation", "Noop"),
    optional: true
  },
  typeParameters: {
    validate: (0, utils.assertNodeType)("TSTypeParameterDeclaration", "Noop"),
    optional: true
  }
});
defineType("TSParameterProperty", {
  aliases: ["LVal"],
  visitor: ["parameter"],
  fields: {
    accessibility: {
      validate: (0, utils.assertOneOf)("public", "private", "protected"),
      optional: true
    },
    readonly: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    parameter: {
      validate: (0, utils.assertNodeType)("Identifier", "AssignmentPattern")
    },
    override: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    decorators: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("Decorator"))),
      optional: true
    }
  }
});
defineType("TSDeclareFunction", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "params", "returnType"],
  fields: Object.assign({}, (0, core.functionDeclarationCommon)(), tSFunctionTypeAnnotationCommon())
});
defineType("TSDeclareMethod", {
  visitor: ["decorators", "key", "typeParameters", "params", "returnType"],
  fields: Object.assign({}, (0, core.classMethodOrDeclareMethodCommon)(), tSFunctionTypeAnnotationCommon())
});
defineType("TSQualifiedName", {
  aliases: ["TSEntityName"],
  visitor: ["left", "right"],
  fields: {
    left: (0, utils.validateType)("TSEntityName"),
    right: (0, utils.validateType)("Identifier")
  }
});
const signatureDeclarationCommon = () => ({
  typeParameters: (0, utils.validateOptionalType)("TSTypeParameterDeclaration"),
  ["parameters"]: (0, utils.validateArrayOfType)(["ArrayPattern", "Identifier", "ObjectPattern", "RestElement"]),
  ["typeAnnotation"]: (0, utils.validateOptionalType)("TSTypeAnnotation")
});
const callConstructSignatureDeclaration = {
  aliases: ["TSTypeElement"],
  visitor: ["typeParameters", "parameters", "typeAnnotation"],
  fields: signatureDeclarationCommon()
};
defineType("TSCallSignatureDeclaration", callConstructSignatureDeclaration);
defineType("TSConstructSignatureDeclaration", callConstructSignatureDeclaration);
const namedTypeElementCommon = () => ({
  key: (0, utils.validateType)("Expression"),
  computed: {
    default: false
  },
  optional: (0, utils.validateOptional)(bool)
});
defineType("TSPropertySignature", {
  aliases: ["TSTypeElement"],
  visitor: ["key", "typeAnnotation"],
  fields: Object.assign({}, namedTypeElementCommon(), {
    readonly: (0, utils.validateOptional)(bool),
    typeAnnotation: (0, utils.validateOptionalType)("TSTypeAnnotation"),
    kind: {
      validate: (0, utils.assertOneOf)("get", "set")
    }
  })
});
defineType("TSMethodSignature", {
  aliases: ["TSTypeElement"],
  visitor: ["key", "typeParameters", "parameters", "typeAnnotation"],
  fields: Object.assign({}, signatureDeclarationCommon(), namedTypeElementCommon(), {
    kind: {
      validate: (0, utils.assertOneOf)("method", "get", "set")
    }
  })
});
defineType("TSIndexSignature", {
  aliases: ["TSTypeElement"],
  visitor: ["parameters", "typeAnnotation"],
  fields: {
    readonly: (0, utils.validateOptional)(bool),
    static: (0, utils.validateOptional)(bool),
    parameters: (0, utils.validateArrayOfType)("Identifier"),
    typeAnnotation: (0, utils.validateOptionalType)("TSTypeAnnotation")
  }
});
const tsKeywordTypes = ["TSAnyKeyword", "TSBooleanKeyword", "TSBigIntKeyword", "TSIntrinsicKeyword", "TSNeverKeyword", "TSNullKeyword", "TSNumberKeyword", "TSObjectKeyword", "TSStringKeyword", "TSSymbolKeyword", "TSUndefinedKeyword", "TSUnknownKeyword", "TSVoidKeyword"];
for (const type of tsKeywordTypes) {
  defineType(type, {
    aliases: ["TSType", "TSBaseType"],
    visitor: [],
    fields: {}
  });
}
defineType("TSThisType", {
  aliases: ["TSType", "TSBaseType"],
  visitor: [],
  fields: {}
});
const fnOrCtrBase = {
  aliases: ["TSType"],
  visitor: ["typeParameters", "parameters", "typeAnnotation"]
};
defineType("TSFunctionType", Object.assign({}, fnOrCtrBase, {
  fields: signatureDeclarationCommon()
}));
defineType("TSConstructorType", Object.assign({}, fnOrCtrBase, {
  fields: Object.assign({}, signatureDeclarationCommon(), {
    abstract: (0, utils.validateOptional)(bool)
  })
}));
defineType("TSTypeReference", {
  aliases: ["TSType"],
  visitor: ["typeName", "typeParameters"],
  fields: {
    typeName: (0, utils.validateType)("TSEntityName"),
    typeParameters: (0, utils.validateOptionalType)("TSTypeParameterInstantiation")
  }
});
defineType("TSTypePredicate", {
  aliases: ["TSType"],
  visitor: ["parameterName", "typeAnnotation"],
  builder: ["parameterName", "typeAnnotation", "asserts"],
  fields: {
    parameterName: (0, utils.validateType)(["Identifier", "TSThisType"]),
    typeAnnotation: (0, utils.validateOptionalType)("TSTypeAnnotation"),
    asserts: (0, utils.validateOptional)(bool)
  }
});
defineType("TSTypeQuery", {
  aliases: ["TSType"],
  visitor: ["exprName", "typeParameters"],
  fields: {
    exprName: (0, utils.validateType)(["TSEntityName", "TSImportType"]),
    typeParameters: (0, utils.validateOptionalType)("TSTypeParameterInstantiation")
  }
});
defineType("TSTypeLiteral", {
  aliases: ["TSType"],
  visitor: ["members"],
  fields: {
    members: (0, utils.validateArrayOfType)("TSTypeElement")
  }
});
defineType("TSArrayType", {
  aliases: ["TSType"],
  visitor: ["elementType"],
  fields: {
    elementType: (0, utils.validateType)("TSType")
  }
});
defineType("TSTupleType", {
  aliases: ["TSType"],
  visitor: ["elementTypes"],
  fields: {
    elementTypes: (0, utils.validateArrayOfType)(["TSType", "TSNamedTupleMember"])
  }
});
defineType("TSOptionalType", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: (0, utils.validateType)("TSType")
  }
});
defineType("TSRestType", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: (0, utils.validateType)("TSType")
  }
});
defineType("TSNamedTupleMember", {
  visitor: ["label", "elementType"],
  builder: ["label", "elementType", "optional"],
  fields: {
    label: (0, utils.validateType)("Identifier"),
    optional: {
      validate: bool,
      default: false
    },
    elementType: (0, utils.validateType)("TSType")
  }
});
const unionOrIntersection = {
  aliases: ["TSType"],
  visitor: ["types"],
  fields: {
    types: (0, utils.validateArrayOfType)("TSType")
  }
};
defineType("TSUnionType", unionOrIntersection);
defineType("TSIntersectionType", unionOrIntersection);
defineType("TSConditionalType", {
  aliases: ["TSType"],
  visitor: ["checkType", "extendsType", "trueType", "falseType"],
  fields: {
    checkType: (0, utils.validateType)("TSType"),
    extendsType: (0, utils.validateType)("TSType"),
    trueType: (0, utils.validateType)("TSType"),
    falseType: (0, utils.validateType)("TSType")
  }
});
defineType("TSInferType", {
  aliases: ["TSType"],
  visitor: ["typeParameter"],
  fields: {
    typeParameter: (0, utils.validateType)("TSTypeParameter")
  }
});
defineType("TSParenthesizedType", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: (0, utils.validateType)("TSType")
  }
});
defineType("TSTypeOperator", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    operator: (0, utils.validate)((0, utils.assertValueType)("string")),
    typeAnnotation: (0, utils.validateType)("TSType")
  }
});
defineType("TSIndexedAccessType", {
  aliases: ["TSType"],
  visitor: ["objectType", "indexType"],
  fields: {
    objectType: (0, utils.validateType)("TSType"),
    indexType: (0, utils.validateType)("TSType")
  }
});
defineType("TSMappedType", {
  aliases: ["TSType"],
  visitor: ["typeParameter", "typeAnnotation", "nameType"],
  fields: {
    readonly: (0, utils.validateOptional)((0, utils.assertOneOf)(true, false, "+", "-")),
    typeParameter: (0, utils.validateType)("TSTypeParameter"),
    optional: (0, utils.validateOptional)((0, utils.assertOneOf)(true, false, "+", "-")),
    typeAnnotation: (0, utils.validateOptionalType)("TSType"),
    nameType: (0, utils.validateOptionalType)("TSType")
  }
});
defineType("TSLiteralType", {
  aliases: ["TSType", "TSBaseType"],
  visitor: ["literal"],
  fields: {
    literal: {
      validate: function () {
        const unaryExpression = (0, utils.assertNodeType)("NumericLiteral", "BigIntLiteral");
        const unaryOperator = (0, utils.assertOneOf)("-");
        const literal = (0, utils.assertNodeType)("NumericLiteral", "StringLiteral", "BooleanLiteral", "BigIntLiteral", "TemplateLiteral");
        function validator(parent, key, node) {
          if ((0, is_1.default)("UnaryExpression", node)) {
            unaryOperator(node, "operator", node.operator);
            unaryExpression(node, "argument", node.argument);
          } else {
            literal(parent, key, node);
          }
        }
        validator.oneOfNodeTypes = ["NumericLiteral", "StringLiteral", "BooleanLiteral", "BigIntLiteral", "TemplateLiteral", "UnaryExpression"];
        return validator;
      }()
    }
  }
});
defineType("TSExpressionWithTypeArguments", {
  aliases: ["TSType"],
  visitor: ["expression", "typeParameters"],
  fields: {
    expression: (0, utils.validateType)("TSEntityName"),
    typeParameters: (0, utils.validateOptionalType)("TSTypeParameterInstantiation")
  }
});
defineType("TSInterfaceDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "extends", "body"],
  fields: {
    declare: (0, utils.validateOptional)(bool),
    id: (0, utils.validateType)("Identifier"),
    typeParameters: (0, utils.validateOptionalType)("TSTypeParameterDeclaration"),
    extends: (0, utils.validateOptional)((0, utils.arrayOfType)("TSExpressionWithTypeArguments")),
    body: (0, utils.validateType)("TSInterfaceBody")
  }
});
defineType("TSInterfaceBody", {
  visitor: ["body"],
  fields: {
    body: (0, utils.validateArrayOfType)("TSTypeElement")
  }
});
defineType("TSTypeAliasDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "typeAnnotation"],
  fields: {
    declare: (0, utils.validateOptional)(bool),
    id: (0, utils.validateType)("Identifier"),
    typeParameters: (0, utils.validateOptionalType)("TSTypeParameterDeclaration"),
    typeAnnotation: (0, utils.validateType)("TSType")
  }
});
defineType("TSInstantiationExpression", {
  aliases: ["Expression"],
  visitor: ["expression", "typeParameters"],
  fields: {
    expression: (0, utils.validateType)("Expression"),
    typeParameters: (0, utils.validateOptionalType)("TSTypeParameterInstantiation")
  }
});
const TSTypeExpression = {
  aliases: ["Expression", "LVal", "PatternLike"],
  visitor: ["expression", "typeAnnotation"],
  fields: {
    expression: (0, utils.validateType)("Expression"),
    typeAnnotation: (0, utils.validateType)("TSType")
  }
};
defineType("TSAsExpression", TSTypeExpression);
defineType("TSSatisfiesExpression", TSTypeExpression);
defineType("TSTypeAssertion", {
  aliases: ["Expression", "LVal", "PatternLike"],
  visitor: ["typeAnnotation", "expression"],
  fields: {
    typeAnnotation: (0, utils.validateType)("TSType"),
    expression: (0, utils.validateType)("Expression")
  }
});
defineType("TSEnumDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "members"],
  fields: {
    declare: (0, utils.validateOptional)(bool),
    const: (0, utils.validateOptional)(bool),
    id: (0, utils.validateType)("Identifier"),
    members: (0, utils.validateArrayOfType)("TSEnumMember"),
    initializer: (0, utils.validateOptionalType)("Expression")
  }
});
defineType("TSEnumMember", {
  visitor: ["id", "initializer"],
  fields: {
    id: (0, utils.validateType)(["Identifier", "StringLiteral"]),
    initializer: (0, utils.validateOptionalType)("Expression")
  }
});
defineType("TSModuleDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "body"],
  fields: {
    declare: (0, utils.validateOptional)(bool),
    global: (0, utils.validateOptional)(bool),
    id: (0, utils.validateType)(["Identifier", "StringLiteral"]),
    body: (0, utils.validateType)(["TSModuleBlock", "TSModuleDeclaration"])
  }
});
defineType("TSModuleBlock", {
  aliases: ["Scopable", "Block", "BlockParent", "FunctionParent"],
  visitor: ["body"],
  fields: {
    body: (0, utils.validateArrayOfType)("Statement")
  }
});
defineType("TSImportType", {
  aliases: ["TSType"],
  visitor: ["argument", "qualifier", "typeParameters"],
  fields: {
    argument: (0, utils.validateType)("StringLiteral"),
    qualifier: (0, utils.validateOptionalType)("TSEntityName"),
    typeParameters: (0, utils.validateOptionalType)("TSTypeParameterInstantiation"),
    options: {
      validate: (0, utils.assertNodeType)("Expression"),
      optional: true
    }
  }
});
defineType("TSImportEqualsDeclaration", {
  aliases: ["Statement"],
  visitor: ["id", "moduleReference"],
  fields: {
    isExport: (0, utils.validate)(bool),
    id: (0, utils.validateType)("Identifier"),
    moduleReference: (0, utils.validateType)(["TSEntityName", "TSExternalModuleReference"]),
    importKind: {
      validate: (0, utils.assertOneOf)("type", "value"),
      optional: true
    }
  }
});
defineType("TSExternalModuleReference", {
  visitor: ["expression"],
  fields: {
    expression: (0, utils.validateType)("StringLiteral")
  }
});
defineType("TSNonNullExpression", {
  aliases: ["Expression", "LVal", "PatternLike"],
  visitor: ["expression"],
  fields: {
    expression: (0, utils.validateType)("Expression")
  }
});
defineType("TSExportAssignment", {
  aliases: ["Statement"],
  visitor: ["expression"],
  fields: {
    expression: (0, utils.validateType)("Expression")
  }
});
defineType("TSNamespaceExportDeclaration", {
  aliases: ["Statement"],
  visitor: ["id"],
  fields: {
    id: (0, utils.validateType)("Identifier")
  }
});
defineType("TSTypeAnnotation", {
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: {
      validate: (0, utils.assertNodeType)("TSType")
    }
  }
});
defineType("TSTypeParameterInstantiation", {
  visitor: ["params"],
  fields: {
    params: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("TSType")))
    }
  }
});
defineType("TSTypeParameterDeclaration", {
  visitor: ["params"],
  fields: {
    params: {
      validate: (0, utils.chain)((0, utils.assertValueType)("array"), (0, utils.assertEach)((0, utils.assertNodeType)("TSTypeParameter")))
    }
  }
});
defineType("TSTypeParameter", {
  builder: ["constraint", "default", "name"],
  visitor: ["constraint", "default"],
  fields: {
    name: {
      validate: (0, utils.assertValueType)("string")
    },
    in: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    out: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    const: {
      validate: (0, utils.assertValueType)("boolean"),
      optional: true
    },
    constraint: {
      validate: (0, utils.assertNodeType)("TSType"),
      optional: true
    },
    default: {
      validate: (0, utils.assertNodeType)("TSType"),
      optional: true
    }
  }
});

var deprecatedAliases = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEPRECATED_ALIASES = void 0;
exports.DEPRECATED_ALIASES = {
  ModuleDeclaration: "ImportOrExportDeclaration"
};


});

unwrapExports(deprecatedAliases);
deprecatedAliases.DEPRECATED_ALIASES;

var definitions = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ALIAS_KEYS", {
  enumerable: true,
  get: function () {
    return utils.ALIAS_KEYS;
  }
});
Object.defineProperty(exports, "BUILDER_KEYS", {
  enumerable: true,
  get: function () {
    return utils.BUILDER_KEYS;
  }
});
Object.defineProperty(exports, "DEPRECATED_ALIASES", {
  enumerable: true,
  get: function () {
    return deprecatedAliases.DEPRECATED_ALIASES;
  }
});
Object.defineProperty(exports, "DEPRECATED_KEYS", {
  enumerable: true,
  get: function () {
    return utils.DEPRECATED_KEYS;
  }
});
Object.defineProperty(exports, "FLIPPED_ALIAS_KEYS", {
  enumerable: true,
  get: function () {
    return utils.FLIPPED_ALIAS_KEYS;
  }
});
Object.defineProperty(exports, "NODE_FIELDS", {
  enumerable: true,
  get: function () {
    return utils.NODE_FIELDS;
  }
});
Object.defineProperty(exports, "NODE_PARENT_VALIDATIONS", {
  enumerable: true,
  get: function () {
    return utils.NODE_PARENT_VALIDATIONS;
  }
});
Object.defineProperty(exports, "PLACEHOLDERS", {
  enumerable: true,
  get: function () {
    return placeholders.PLACEHOLDERS;
  }
});
Object.defineProperty(exports, "PLACEHOLDERS_ALIAS", {
  enumerable: true,
  get: function () {
    return placeholders.PLACEHOLDERS_ALIAS;
  }
});
Object.defineProperty(exports, "PLACEHOLDERS_FLIPPED_ALIAS", {
  enumerable: true,
  get: function () {
    return placeholders.PLACEHOLDERS_FLIPPED_ALIAS;
  }
});
exports.TYPES = void 0;
Object.defineProperty(exports, "VISITOR_KEYS", {
  enumerable: true,
  get: function () {
    return utils.VISITOR_KEYS;
  }
});










Object.keys(deprecatedAliases.DEPRECATED_ALIASES).forEach(deprecatedAlias => {
  utils.FLIPPED_ALIAS_KEYS[deprecatedAlias] = utils.FLIPPED_ALIAS_KEYS[deprecatedAliases.DEPRECATED_ALIASES[deprecatedAlias]];
});
toFastProperties(utils.VISITOR_KEYS);
toFastProperties(utils.ALIAS_KEYS);
toFastProperties(utils.FLIPPED_ALIAS_KEYS);
toFastProperties(utils.NODE_FIELDS);
toFastProperties(utils.BUILDER_KEYS);
toFastProperties(utils.DEPRECATED_KEYS);
toFastProperties(placeholders.PLACEHOLDERS_ALIAS);
toFastProperties(placeholders.PLACEHOLDERS_FLIPPED_ALIAS);
exports.TYPES = [].concat(Object.keys(utils.VISITOR_KEYS), Object.keys(utils.FLIPPED_ALIAS_KEYS), Object.keys(utils.DEPRECATED_KEYS));


});

unwrapExports(definitions);
definitions.TYPES;

var validate_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validate;
exports.validateChild = validateChild;
exports.validateField = validateField;

function validate(node, key, val) {
  if (!node) return;
  const fields = definitions.NODE_FIELDS[node.type];
  if (!fields) return;
  const field = fields[key];
  validateField(node, key, val, field);
  validateChild(node, key, val);
}
function validateField(node, key, val, field) {
  if (!(field != null && field.validate)) return;
  if (field.optional && val == null) return;
  field.validate(node, key, val);
}
function validateChild(node, key, val) {
  if (val == null) return;
  const validate = definitions.NODE_PARENT_VALIDATIONS[val.type];
  if (!validate) return;
  validate(node, key, val);
}


});

unwrapExports(validate_1);
validate_1.validateChild;
validate_1.validateField;

var validateNode_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateNode;


function validateNode(node) {
  const keys = lib.BUILDER_KEYS[node.type];
  for (const key of keys) {
    (0, validate_1.default)(node, key, node[key]);
  }
  return node;
}


});

unwrapExports(validateNode_1);

var generated$2 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anyTypeAnnotation = anyTypeAnnotation;
exports.argumentPlaceholder = argumentPlaceholder;
exports.arrayExpression = arrayExpression;
exports.arrayPattern = arrayPattern;
exports.arrayTypeAnnotation = arrayTypeAnnotation;
exports.arrowFunctionExpression = arrowFunctionExpression;
exports.assignmentExpression = assignmentExpression;
exports.assignmentPattern = assignmentPattern;
exports.awaitExpression = awaitExpression;
exports.bigIntLiteral = bigIntLiteral;
exports.binaryExpression = binaryExpression;
exports.bindExpression = bindExpression;
exports.blockStatement = blockStatement;
exports.booleanLiteral = booleanLiteral;
exports.booleanLiteralTypeAnnotation = booleanLiteralTypeAnnotation;
exports.booleanTypeAnnotation = booleanTypeAnnotation;
exports.breakStatement = breakStatement;
exports.callExpression = callExpression;
exports.catchClause = catchClause;
exports.classAccessorProperty = classAccessorProperty;
exports.classBody = classBody;
exports.classDeclaration = classDeclaration;
exports.classExpression = classExpression;
exports.classImplements = classImplements;
exports.classMethod = classMethod;
exports.classPrivateMethod = classPrivateMethod;
exports.classPrivateProperty = classPrivateProperty;
exports.classProperty = classProperty;
exports.conditionalExpression = conditionalExpression;
exports.continueStatement = continueStatement;
exports.debuggerStatement = debuggerStatement;
exports.decimalLiteral = decimalLiteral;
exports.declareClass = declareClass;
exports.declareExportAllDeclaration = declareExportAllDeclaration;
exports.declareExportDeclaration = declareExportDeclaration;
exports.declareFunction = declareFunction;
exports.declareInterface = declareInterface;
exports.declareModule = declareModule;
exports.declareModuleExports = declareModuleExports;
exports.declareOpaqueType = declareOpaqueType;
exports.declareTypeAlias = declareTypeAlias;
exports.declareVariable = declareVariable;
exports.declaredPredicate = declaredPredicate;
exports.decorator = decorator;
exports.directive = directive;
exports.directiveLiteral = directiveLiteral;
exports.doExpression = doExpression;
exports.doWhileStatement = doWhileStatement;
exports.emptyStatement = emptyStatement;
exports.emptyTypeAnnotation = emptyTypeAnnotation;
exports.enumBooleanBody = enumBooleanBody;
exports.enumBooleanMember = enumBooleanMember;
exports.enumDeclaration = enumDeclaration;
exports.enumDefaultedMember = enumDefaultedMember;
exports.enumNumberBody = enumNumberBody;
exports.enumNumberMember = enumNumberMember;
exports.enumStringBody = enumStringBody;
exports.enumStringMember = enumStringMember;
exports.enumSymbolBody = enumSymbolBody;
exports.existsTypeAnnotation = existsTypeAnnotation;
exports.exportAllDeclaration = exportAllDeclaration;
exports.exportDefaultDeclaration = exportDefaultDeclaration;
exports.exportDefaultSpecifier = exportDefaultSpecifier;
exports.exportNamedDeclaration = exportNamedDeclaration;
exports.exportNamespaceSpecifier = exportNamespaceSpecifier;
exports.exportSpecifier = exportSpecifier;
exports.expressionStatement = expressionStatement;
exports.file = file;
exports.forInStatement = forInStatement;
exports.forOfStatement = forOfStatement;
exports.forStatement = forStatement;
exports.functionDeclaration = functionDeclaration;
exports.functionExpression = functionExpression;
exports.functionTypeAnnotation = functionTypeAnnotation;
exports.functionTypeParam = functionTypeParam;
exports.genericTypeAnnotation = genericTypeAnnotation;
exports.identifier = identifier;
exports.ifStatement = ifStatement;
exports.import = _import;
exports.importAttribute = importAttribute;
exports.importDeclaration = importDeclaration;
exports.importDefaultSpecifier = importDefaultSpecifier;
exports.importExpression = importExpression;
exports.importNamespaceSpecifier = importNamespaceSpecifier;
exports.importSpecifier = importSpecifier;
exports.indexedAccessType = indexedAccessType;
exports.inferredPredicate = inferredPredicate;
exports.interfaceDeclaration = interfaceDeclaration;
exports.interfaceExtends = interfaceExtends;
exports.interfaceTypeAnnotation = interfaceTypeAnnotation;
exports.interpreterDirective = interpreterDirective;
exports.intersectionTypeAnnotation = intersectionTypeAnnotation;
exports.jSXAttribute = exports.jsxAttribute = jsxAttribute;
exports.jSXClosingElement = exports.jsxClosingElement = jsxClosingElement;
exports.jSXClosingFragment = exports.jsxClosingFragment = jsxClosingFragment;
exports.jSXElement = exports.jsxElement = jsxElement;
exports.jSXEmptyExpression = exports.jsxEmptyExpression = jsxEmptyExpression;
exports.jSXExpressionContainer = exports.jsxExpressionContainer = jsxExpressionContainer;
exports.jSXFragment = exports.jsxFragment = jsxFragment;
exports.jSXIdentifier = exports.jsxIdentifier = jsxIdentifier;
exports.jSXMemberExpression = exports.jsxMemberExpression = jsxMemberExpression;
exports.jSXNamespacedName = exports.jsxNamespacedName = jsxNamespacedName;
exports.jSXOpeningElement = exports.jsxOpeningElement = jsxOpeningElement;
exports.jSXOpeningFragment = exports.jsxOpeningFragment = jsxOpeningFragment;
exports.jSXSpreadAttribute = exports.jsxSpreadAttribute = jsxSpreadAttribute;
exports.jSXSpreadChild = exports.jsxSpreadChild = jsxSpreadChild;
exports.jSXText = exports.jsxText = jsxText;
exports.labeledStatement = labeledStatement;
exports.logicalExpression = logicalExpression;
exports.memberExpression = memberExpression;
exports.metaProperty = metaProperty;
exports.mixedTypeAnnotation = mixedTypeAnnotation;
exports.moduleExpression = moduleExpression;
exports.newExpression = newExpression;
exports.noop = noop;
exports.nullLiteral = nullLiteral;
exports.nullLiteralTypeAnnotation = nullLiteralTypeAnnotation;
exports.nullableTypeAnnotation = nullableTypeAnnotation;
exports.numberLiteral = NumberLiteral;
exports.numberLiteralTypeAnnotation = numberLiteralTypeAnnotation;
exports.numberTypeAnnotation = numberTypeAnnotation;
exports.numericLiteral = numericLiteral;
exports.objectExpression = objectExpression;
exports.objectMethod = objectMethod;
exports.objectPattern = objectPattern;
exports.objectProperty = objectProperty;
exports.objectTypeAnnotation = objectTypeAnnotation;
exports.objectTypeCallProperty = objectTypeCallProperty;
exports.objectTypeIndexer = objectTypeIndexer;
exports.objectTypeInternalSlot = objectTypeInternalSlot;
exports.objectTypeProperty = objectTypeProperty;
exports.objectTypeSpreadProperty = objectTypeSpreadProperty;
exports.opaqueType = opaqueType;
exports.optionalCallExpression = optionalCallExpression;
exports.optionalIndexedAccessType = optionalIndexedAccessType;
exports.optionalMemberExpression = optionalMemberExpression;
exports.parenthesizedExpression = parenthesizedExpression;
exports.pipelineBareFunction = pipelineBareFunction;
exports.pipelinePrimaryTopicReference = pipelinePrimaryTopicReference;
exports.pipelineTopicExpression = pipelineTopicExpression;
exports.placeholder = placeholder;
exports.privateName = privateName;
exports.program = program;
exports.qualifiedTypeIdentifier = qualifiedTypeIdentifier;
exports.recordExpression = recordExpression;
exports.regExpLiteral = regExpLiteral;
exports.regexLiteral = RegexLiteral;
exports.restElement = restElement;
exports.restProperty = RestProperty;
exports.returnStatement = returnStatement;
exports.sequenceExpression = sequenceExpression;
exports.spreadElement = spreadElement;
exports.spreadProperty = SpreadProperty;
exports.staticBlock = staticBlock;
exports.stringLiteral = stringLiteral;
exports.stringLiteralTypeAnnotation = stringLiteralTypeAnnotation;
exports.stringTypeAnnotation = stringTypeAnnotation;
exports.super = _super;
exports.switchCase = switchCase;
exports.switchStatement = switchStatement;
exports.symbolTypeAnnotation = symbolTypeAnnotation;
exports.taggedTemplateExpression = taggedTemplateExpression;
exports.templateElement = templateElement;
exports.templateLiteral = templateLiteral;
exports.thisExpression = thisExpression;
exports.thisTypeAnnotation = thisTypeAnnotation;
exports.throwStatement = throwStatement;
exports.topicReference = topicReference;
exports.tryStatement = tryStatement;
exports.tSAnyKeyword = exports.tsAnyKeyword = tsAnyKeyword;
exports.tSArrayType = exports.tsArrayType = tsArrayType;
exports.tSAsExpression = exports.tsAsExpression = tsAsExpression;
exports.tSBigIntKeyword = exports.tsBigIntKeyword = tsBigIntKeyword;
exports.tSBooleanKeyword = exports.tsBooleanKeyword = tsBooleanKeyword;
exports.tSCallSignatureDeclaration = exports.tsCallSignatureDeclaration = tsCallSignatureDeclaration;
exports.tSConditionalType = exports.tsConditionalType = tsConditionalType;
exports.tSConstructSignatureDeclaration = exports.tsConstructSignatureDeclaration = tsConstructSignatureDeclaration;
exports.tSConstructorType = exports.tsConstructorType = tsConstructorType;
exports.tSDeclareFunction = exports.tsDeclareFunction = tsDeclareFunction;
exports.tSDeclareMethod = exports.tsDeclareMethod = tsDeclareMethod;
exports.tSEnumDeclaration = exports.tsEnumDeclaration = tsEnumDeclaration;
exports.tSEnumMember = exports.tsEnumMember = tsEnumMember;
exports.tSExportAssignment = exports.tsExportAssignment = tsExportAssignment;
exports.tSExpressionWithTypeArguments = exports.tsExpressionWithTypeArguments = tsExpressionWithTypeArguments;
exports.tSExternalModuleReference = exports.tsExternalModuleReference = tsExternalModuleReference;
exports.tSFunctionType = exports.tsFunctionType = tsFunctionType;
exports.tSImportEqualsDeclaration = exports.tsImportEqualsDeclaration = tsImportEqualsDeclaration;
exports.tSImportType = exports.tsImportType = tsImportType;
exports.tSIndexSignature = exports.tsIndexSignature = tsIndexSignature;
exports.tSIndexedAccessType = exports.tsIndexedAccessType = tsIndexedAccessType;
exports.tSInferType = exports.tsInferType = tsInferType;
exports.tSInstantiationExpression = exports.tsInstantiationExpression = tsInstantiationExpression;
exports.tSInterfaceBody = exports.tsInterfaceBody = tsInterfaceBody;
exports.tSInterfaceDeclaration = exports.tsInterfaceDeclaration = tsInterfaceDeclaration;
exports.tSIntersectionType = exports.tsIntersectionType = tsIntersectionType;
exports.tSIntrinsicKeyword = exports.tsIntrinsicKeyword = tsIntrinsicKeyword;
exports.tSLiteralType = exports.tsLiteralType = tsLiteralType;
exports.tSMappedType = exports.tsMappedType = tsMappedType;
exports.tSMethodSignature = exports.tsMethodSignature = tsMethodSignature;
exports.tSModuleBlock = exports.tsModuleBlock = tsModuleBlock;
exports.tSModuleDeclaration = exports.tsModuleDeclaration = tsModuleDeclaration;
exports.tSNamedTupleMember = exports.tsNamedTupleMember = tsNamedTupleMember;
exports.tSNamespaceExportDeclaration = exports.tsNamespaceExportDeclaration = tsNamespaceExportDeclaration;
exports.tSNeverKeyword = exports.tsNeverKeyword = tsNeverKeyword;
exports.tSNonNullExpression = exports.tsNonNullExpression = tsNonNullExpression;
exports.tSNullKeyword = exports.tsNullKeyword = tsNullKeyword;
exports.tSNumberKeyword = exports.tsNumberKeyword = tsNumberKeyword;
exports.tSObjectKeyword = exports.tsObjectKeyword = tsObjectKeyword;
exports.tSOptionalType = exports.tsOptionalType = tsOptionalType;
exports.tSParameterProperty = exports.tsParameterProperty = tsParameterProperty;
exports.tSParenthesizedType = exports.tsParenthesizedType = tsParenthesizedType;
exports.tSPropertySignature = exports.tsPropertySignature = tsPropertySignature;
exports.tSQualifiedName = exports.tsQualifiedName = tsQualifiedName;
exports.tSRestType = exports.tsRestType = tsRestType;
exports.tSSatisfiesExpression = exports.tsSatisfiesExpression = tsSatisfiesExpression;
exports.tSStringKeyword = exports.tsStringKeyword = tsStringKeyword;
exports.tSSymbolKeyword = exports.tsSymbolKeyword = tsSymbolKeyword;
exports.tSThisType = exports.tsThisType = tsThisType;
exports.tSTupleType = exports.tsTupleType = tsTupleType;
exports.tSTypeAliasDeclaration = exports.tsTypeAliasDeclaration = tsTypeAliasDeclaration;
exports.tSTypeAnnotation = exports.tsTypeAnnotation = tsTypeAnnotation;
exports.tSTypeAssertion = exports.tsTypeAssertion = tsTypeAssertion;
exports.tSTypeLiteral = exports.tsTypeLiteral = tsTypeLiteral;
exports.tSTypeOperator = exports.tsTypeOperator = tsTypeOperator;
exports.tSTypeParameter = exports.tsTypeParameter = tsTypeParameter;
exports.tSTypeParameterDeclaration = exports.tsTypeParameterDeclaration = tsTypeParameterDeclaration;
exports.tSTypeParameterInstantiation = exports.tsTypeParameterInstantiation = tsTypeParameterInstantiation;
exports.tSTypePredicate = exports.tsTypePredicate = tsTypePredicate;
exports.tSTypeQuery = exports.tsTypeQuery = tsTypeQuery;
exports.tSTypeReference = exports.tsTypeReference = tsTypeReference;
exports.tSUndefinedKeyword = exports.tsUndefinedKeyword = tsUndefinedKeyword;
exports.tSUnionType = exports.tsUnionType = tsUnionType;
exports.tSUnknownKeyword = exports.tsUnknownKeyword = tsUnknownKeyword;
exports.tSVoidKeyword = exports.tsVoidKeyword = tsVoidKeyword;
exports.tupleExpression = tupleExpression;
exports.tupleTypeAnnotation = tupleTypeAnnotation;
exports.typeAlias = typeAlias;
exports.typeAnnotation = typeAnnotation;
exports.typeCastExpression = typeCastExpression;
exports.typeParameter = typeParameter;
exports.typeParameterDeclaration = typeParameterDeclaration;
exports.typeParameterInstantiation = typeParameterInstantiation;
exports.typeofTypeAnnotation = typeofTypeAnnotation;
exports.unaryExpression = unaryExpression;
exports.unionTypeAnnotation = unionTypeAnnotation;
exports.updateExpression = updateExpression;
exports.v8IntrinsicIdentifier = v8IntrinsicIdentifier;
exports.variableDeclaration = variableDeclaration;
exports.variableDeclarator = variableDeclarator;
exports.variance = variance;
exports.voidTypeAnnotation = voidTypeAnnotation;
exports.whileStatement = whileStatement;
exports.withStatement = withStatement;
exports.yieldExpression = yieldExpression;


function arrayExpression(elements = []) {
  return (0, validateNode_1.default)({
    type: "ArrayExpression",
    elements
  });
}
function assignmentExpression(operator, left, right) {
  return (0, validateNode_1.default)({
    type: "AssignmentExpression",
    operator,
    left,
    right
  });
}
function binaryExpression(operator, left, right) {
  return (0, validateNode_1.default)({
    type: "BinaryExpression",
    operator,
    left,
    right
  });
}
function interpreterDirective(value) {
  return (0, validateNode_1.default)({
    type: "InterpreterDirective",
    value
  });
}
function directive(value) {
  return (0, validateNode_1.default)({
    type: "Directive",
    value
  });
}
function directiveLiteral(value) {
  return (0, validateNode_1.default)({
    type: "DirectiveLiteral",
    value
  });
}
function blockStatement(body, directives = []) {
  return (0, validateNode_1.default)({
    type: "BlockStatement",
    body,
    directives
  });
}
function breakStatement(label = null) {
  return (0, validateNode_1.default)({
    type: "BreakStatement",
    label
  });
}
function callExpression(callee, _arguments) {
  return (0, validateNode_1.default)({
    type: "CallExpression",
    callee,
    arguments: _arguments
  });
}
function catchClause(param = null, body) {
  return (0, validateNode_1.default)({
    type: "CatchClause",
    param,
    body
  });
}
function conditionalExpression(test, consequent, alternate) {
  return (0, validateNode_1.default)({
    type: "ConditionalExpression",
    test,
    consequent,
    alternate
  });
}
function continueStatement(label = null) {
  return (0, validateNode_1.default)({
    type: "ContinueStatement",
    label
  });
}
function debuggerStatement() {
  return {
    type: "DebuggerStatement"
  };
}
function doWhileStatement(test, body) {
  return (0, validateNode_1.default)({
    type: "DoWhileStatement",
    test,
    body
  });
}
function emptyStatement() {
  return {
    type: "EmptyStatement"
  };
}
function expressionStatement(expression) {
  return (0, validateNode_1.default)({
    type: "ExpressionStatement",
    expression
  });
}
function file(program, comments = null, tokens = null) {
  return (0, validateNode_1.default)({
    type: "File",
    program,
    comments,
    tokens
  });
}
function forInStatement(left, right, body) {
  return (0, validateNode_1.default)({
    type: "ForInStatement",
    left,
    right,
    body
  });
}
function forStatement(init = null, test = null, update = null, body) {
  return (0, validateNode_1.default)({
    type: "ForStatement",
    init,
    test,
    update,
    body
  });
}
function functionDeclaration(id = null, params, body, generator = false, async = false) {
  return (0, validateNode_1.default)({
    type: "FunctionDeclaration",
    id,
    params,
    body,
    generator,
    async
  });
}
function functionExpression(id = null, params, body, generator = false, async = false) {
  return (0, validateNode_1.default)({
    type: "FunctionExpression",
    id,
    params,
    body,
    generator,
    async
  });
}
function identifier(name) {
  return (0, validateNode_1.default)({
    type: "Identifier",
    name
  });
}
function ifStatement(test, consequent, alternate = null) {
  return (0, validateNode_1.default)({
    type: "IfStatement",
    test,
    consequent,
    alternate
  });
}
function labeledStatement(label, body) {
  return (0, validateNode_1.default)({
    type: "LabeledStatement",
    label,
    body
  });
}
function stringLiteral(value) {
  return (0, validateNode_1.default)({
    type: "StringLiteral",
    value
  });
}
function numericLiteral(value) {
  return (0, validateNode_1.default)({
    type: "NumericLiteral",
    value
  });
}
function nullLiteral() {
  return {
    type: "NullLiteral"
  };
}
function booleanLiteral(value) {
  return (0, validateNode_1.default)({
    type: "BooleanLiteral",
    value
  });
}
function regExpLiteral(pattern, flags = "") {
  return (0, validateNode_1.default)({
    type: "RegExpLiteral",
    pattern,
    flags
  });
}
function logicalExpression(operator, left, right) {
  return (0, validateNode_1.default)({
    type: "LogicalExpression",
    operator,
    left,
    right
  });
}
function memberExpression(object, property, computed = false, optional = null) {
  return (0, validateNode_1.default)({
    type: "MemberExpression",
    object,
    property,
    computed,
    optional
  });
}
function newExpression(callee, _arguments) {
  return (0, validateNode_1.default)({
    type: "NewExpression",
    callee,
    arguments: _arguments
  });
}
function program(body, directives = [], sourceType = "script", interpreter = null) {
  return (0, validateNode_1.default)({
    type: "Program",
    body,
    directives,
    sourceType,
    interpreter
  });
}
function objectExpression(properties) {
  return (0, validateNode_1.default)({
    type: "ObjectExpression",
    properties
  });
}
function objectMethod(kind = "method", key, params, body, computed = false, generator = false, async = false) {
  return (0, validateNode_1.default)({
    type: "ObjectMethod",
    kind,
    key,
    params,
    body,
    computed,
    generator,
    async
  });
}
function objectProperty(key, value, computed = false, shorthand = false, decorators = null) {
  return (0, validateNode_1.default)({
    type: "ObjectProperty",
    key,
    value,
    computed,
    shorthand,
    decorators
  });
}
function restElement(argument) {
  return (0, validateNode_1.default)({
    type: "RestElement",
    argument
  });
}
function returnStatement(argument = null) {
  return (0, validateNode_1.default)({
    type: "ReturnStatement",
    argument
  });
}
function sequenceExpression(expressions) {
  return (0, validateNode_1.default)({
    type: "SequenceExpression",
    expressions
  });
}
function parenthesizedExpression(expression) {
  return (0, validateNode_1.default)({
    type: "ParenthesizedExpression",
    expression
  });
}
function switchCase(test = null, consequent) {
  return (0, validateNode_1.default)({
    type: "SwitchCase",
    test,
    consequent
  });
}
function switchStatement(discriminant, cases) {
  return (0, validateNode_1.default)({
    type: "SwitchStatement",
    discriminant,
    cases
  });
}
function thisExpression() {
  return {
    type: "ThisExpression"
  };
}
function throwStatement(argument) {
  return (0, validateNode_1.default)({
    type: "ThrowStatement",
    argument
  });
}
function tryStatement(block, handler = null, finalizer = null) {
  return (0, validateNode_1.default)({
    type: "TryStatement",
    block,
    handler,
    finalizer
  });
}
function unaryExpression(operator, argument, prefix = true) {
  return (0, validateNode_1.default)({
    type: "UnaryExpression",
    operator,
    argument,
    prefix
  });
}
function updateExpression(operator, argument, prefix = false) {
  return (0, validateNode_1.default)({
    type: "UpdateExpression",
    operator,
    argument,
    prefix
  });
}
function variableDeclaration(kind, declarations) {
  return (0, validateNode_1.default)({
    type: "VariableDeclaration",
    kind,
    declarations
  });
}
function variableDeclarator(id, init = null) {
  return (0, validateNode_1.default)({
    type: "VariableDeclarator",
    id,
    init
  });
}
function whileStatement(test, body) {
  return (0, validateNode_1.default)({
    type: "WhileStatement",
    test,
    body
  });
}
function withStatement(object, body) {
  return (0, validateNode_1.default)({
    type: "WithStatement",
    object,
    body
  });
}
function assignmentPattern(left, right) {
  return (0, validateNode_1.default)({
    type: "AssignmentPattern",
    left,
    right
  });
}
function arrayPattern(elements) {
  return (0, validateNode_1.default)({
    type: "ArrayPattern",
    elements
  });
}
function arrowFunctionExpression(params, body, async = false) {
  return (0, validateNode_1.default)({
    type: "ArrowFunctionExpression",
    params,
    body,
    async,
    expression: null
  });
}
function classBody(body) {
  return (0, validateNode_1.default)({
    type: "ClassBody",
    body
  });
}
function classExpression(id = null, superClass = null, body, decorators = null) {
  return (0, validateNode_1.default)({
    type: "ClassExpression",
    id,
    superClass,
    body,
    decorators
  });
}
function classDeclaration(id = null, superClass = null, body, decorators = null) {
  return (0, validateNode_1.default)({
    type: "ClassDeclaration",
    id,
    superClass,
    body,
    decorators
  });
}
function exportAllDeclaration(source) {
  return (0, validateNode_1.default)({
    type: "ExportAllDeclaration",
    source
  });
}
function exportDefaultDeclaration(declaration) {
  return (0, validateNode_1.default)({
    type: "ExportDefaultDeclaration",
    declaration
  });
}
function exportNamedDeclaration(declaration = null, specifiers = [], source = null) {
  return (0, validateNode_1.default)({
    type: "ExportNamedDeclaration",
    declaration,
    specifiers,
    source
  });
}
function exportSpecifier(local, exported) {
  return (0, validateNode_1.default)({
    type: "ExportSpecifier",
    local,
    exported
  });
}
function forOfStatement(left, right, body, _await = false) {
  return (0, validateNode_1.default)({
    type: "ForOfStatement",
    left,
    right,
    body,
    await: _await
  });
}
function importDeclaration(specifiers, source) {
  return (0, validateNode_1.default)({
    type: "ImportDeclaration",
    specifiers,
    source
  });
}
function importDefaultSpecifier(local) {
  return (0, validateNode_1.default)({
    type: "ImportDefaultSpecifier",
    local
  });
}
function importNamespaceSpecifier(local) {
  return (0, validateNode_1.default)({
    type: "ImportNamespaceSpecifier",
    local
  });
}
function importSpecifier(local, imported) {
  return (0, validateNode_1.default)({
    type: "ImportSpecifier",
    local,
    imported
  });
}
function importExpression(source, options = null) {
  return (0, validateNode_1.default)({
    type: "ImportExpression",
    source,
    options
  });
}
function metaProperty(meta, property) {
  return (0, validateNode_1.default)({
    type: "MetaProperty",
    meta,
    property
  });
}
function classMethod(kind = "method", key, params, body, computed = false, _static = false, generator = false, async = false) {
  return (0, validateNode_1.default)({
    type: "ClassMethod",
    kind,
    key,
    params,
    body,
    computed,
    static: _static,
    generator,
    async
  });
}
function objectPattern(properties) {
  return (0, validateNode_1.default)({
    type: "ObjectPattern",
    properties
  });
}
function spreadElement(argument) {
  return (0, validateNode_1.default)({
    type: "SpreadElement",
    argument
  });
}
function _super() {
  return {
    type: "Super"
  };
}
function taggedTemplateExpression(tag, quasi) {
  return (0, validateNode_1.default)({
    type: "TaggedTemplateExpression",
    tag,
    quasi
  });
}
function templateElement(value, tail = false) {
  return (0, validateNode_1.default)({
    type: "TemplateElement",
    value,
    tail
  });
}
function templateLiteral(quasis, expressions) {
  return (0, validateNode_1.default)({
    type: "TemplateLiteral",
    quasis,
    expressions
  });
}
function yieldExpression(argument = null, delegate = false) {
  return (0, validateNode_1.default)({
    type: "YieldExpression",
    argument,
    delegate
  });
}
function awaitExpression(argument) {
  return (0, validateNode_1.default)({
    type: "AwaitExpression",
    argument
  });
}
function _import() {
  return {
    type: "Import"
  };
}
function bigIntLiteral(value) {
  return (0, validateNode_1.default)({
    type: "BigIntLiteral",
    value
  });
}
function exportNamespaceSpecifier(exported) {
  return (0, validateNode_1.default)({
    type: "ExportNamespaceSpecifier",
    exported
  });
}
function optionalMemberExpression(object, property, computed = false, optional) {
  return (0, validateNode_1.default)({
    type: "OptionalMemberExpression",
    object,
    property,
    computed,
    optional
  });
}
function optionalCallExpression(callee, _arguments, optional) {
  return (0, validateNode_1.default)({
    type: "OptionalCallExpression",
    callee,
    arguments: _arguments,
    optional
  });
}
function classProperty(key, value = null, typeAnnotation = null, decorators = null, computed = false, _static = false) {
  return (0, validateNode_1.default)({
    type: "ClassProperty",
    key,
    value,
    typeAnnotation,
    decorators,
    computed,
    static: _static
  });
}
function classAccessorProperty(key, value = null, typeAnnotation = null, decorators = null, computed = false, _static = false) {
  return (0, validateNode_1.default)({
    type: "ClassAccessorProperty",
    key,
    value,
    typeAnnotation,
    decorators,
    computed,
    static: _static
  });
}
function classPrivateProperty(key, value = null, decorators = null, _static = false) {
  return (0, validateNode_1.default)({
    type: "ClassPrivateProperty",
    key,
    value,
    decorators,
    static: _static
  });
}
function classPrivateMethod(kind = "method", key, params, body, _static = false) {
  return (0, validateNode_1.default)({
    type: "ClassPrivateMethod",
    kind,
    key,
    params,
    body,
    static: _static
  });
}
function privateName(id) {
  return (0, validateNode_1.default)({
    type: "PrivateName",
    id
  });
}
function staticBlock(body) {
  return (0, validateNode_1.default)({
    type: "StaticBlock",
    body
  });
}
function anyTypeAnnotation() {
  return {
    type: "AnyTypeAnnotation"
  };
}
function arrayTypeAnnotation(elementType) {
  return (0, validateNode_1.default)({
    type: "ArrayTypeAnnotation",
    elementType
  });
}
function booleanTypeAnnotation() {
  return {
    type: "BooleanTypeAnnotation"
  };
}
function booleanLiteralTypeAnnotation(value) {
  return (0, validateNode_1.default)({
    type: "BooleanLiteralTypeAnnotation",
    value
  });
}
function nullLiteralTypeAnnotation() {
  return {
    type: "NullLiteralTypeAnnotation"
  };
}
function classImplements(id, typeParameters = null) {
  return (0, validateNode_1.default)({
    type: "ClassImplements",
    id,
    typeParameters
  });
}
function declareClass(id, typeParameters = null, _extends = null, body) {
  return (0, validateNode_1.default)({
    type: "DeclareClass",
    id,
    typeParameters,
    extends: _extends,
    body
  });
}
function declareFunction(id) {
  return (0, validateNode_1.default)({
    type: "DeclareFunction",
    id
  });
}
function declareInterface(id, typeParameters = null, _extends = null, body) {
  return (0, validateNode_1.default)({
    type: "DeclareInterface",
    id,
    typeParameters,
    extends: _extends,
    body
  });
}
function declareModule(id, body, kind = null) {
  return (0, validateNode_1.default)({
    type: "DeclareModule",
    id,
    body,
    kind
  });
}
function declareModuleExports(typeAnnotation) {
  return (0, validateNode_1.default)({
    type: "DeclareModuleExports",
    typeAnnotation
  });
}
function declareTypeAlias(id, typeParameters = null, right) {
  return (0, validateNode_1.default)({
    type: "DeclareTypeAlias",
    id,
    typeParameters,
    right
  });
}
function declareOpaqueType(id, typeParameters = null, supertype = null) {
  return (0, validateNode_1.default)({
    type: "DeclareOpaqueType",
    id,
    typeParameters,
    supertype
  });
}
function declareVariable(id) {
  return (0, validateNode_1.default)({
    type: "DeclareVariable",
    id
  });
}
function declareExportDeclaration(declaration = null, specifiers = null, source = null) {
  return (0, validateNode_1.default)({
    type: "DeclareExportDeclaration",
    declaration,
    specifiers,
    source
  });
}
function declareExportAllDeclaration(source) {
  return (0, validateNode_1.default)({
    type: "DeclareExportAllDeclaration",
    source
  });
}
function declaredPredicate(value) {
  return (0, validateNode_1.default)({
    type: "DeclaredPredicate",
    value
  });
}
function existsTypeAnnotation() {
  return {
    type: "ExistsTypeAnnotation"
  };
}
function functionTypeAnnotation(typeParameters = null, params, rest = null, returnType) {
  return (0, validateNode_1.default)({
    type: "FunctionTypeAnnotation",
    typeParameters,
    params,
    rest,
    returnType
  });
}
function functionTypeParam(name = null, typeAnnotation) {
  return (0, validateNode_1.default)({
    type: "FunctionTypeParam",
    name,
    typeAnnotation
  });
}
function genericTypeAnnotation(id, typeParameters = null) {
  return (0, validateNode_1.default)({
    type: "GenericTypeAnnotation",
    id,
    typeParameters
  });
}
function inferredPredicate() {
  return {
    type: "InferredPredicate"
  };
}
function interfaceExtends(id, typeParameters = null) {
  return (0, validateNode_1.default)({
    type: "InterfaceExtends",
    id,
    typeParameters
  });
}
function interfaceDeclaration(id, typeParameters = null, _extends = null, body) {
  return (0, validateNode_1.default)({
    type: "InterfaceDeclaration",
    id,
    typeParameters,
    extends: _extends,
    body
  });
}
function interfaceTypeAnnotation(_extends = null, body) {
  return (0, validateNode_1.default)({
    type: "InterfaceTypeAnnotation",
    extends: _extends,
    body
  });
}
function intersectionTypeAnnotation(types) {
  return (0, validateNode_1.default)({
    type: "IntersectionTypeAnnotation",
    types
  });
}
function mixedTypeAnnotation() {
  return {
    type: "MixedTypeAnnotation"
  };
}
function emptyTypeAnnotation() {
  return {
    type: "EmptyTypeAnnotation"
  };
}
function nullableTypeAnnotation(typeAnnotation) {
  return (0, validateNode_1.default)({
    type: "NullableTypeAnnotation",
    typeAnnotation
  });
}
function numberLiteralTypeAnnotation(value) {
  return (0, validateNode_1.default)({
    type: "NumberLiteralTypeAnnotation",
    value
  });
}
function numberTypeAnnotation() {
  return {
    type: "NumberTypeAnnotation"
  };
}
function objectTypeAnnotation(properties, indexers = [], callProperties = [], internalSlots = [], exact = false) {
  return (0, validateNode_1.default)({
    type: "ObjectTypeAnnotation",
    properties,
    indexers,
    callProperties,
    internalSlots,
    exact
  });
}
function objectTypeInternalSlot(id, value, optional, _static, method) {
  return (0, validateNode_1.default)({
    type: "ObjectTypeInternalSlot",
    id,
    value,
    optional,
    static: _static,
    method
  });
}
function objectTypeCallProperty(value) {
  return (0, validateNode_1.default)({
    type: "ObjectTypeCallProperty",
    value,
    static: null
  });
}
function objectTypeIndexer(id = null, key, value, variance = null) {
  return (0, validateNode_1.default)({
    type: "ObjectTypeIndexer",
    id,
    key,
    value,
    variance,
    static: null
  });
}
function objectTypeProperty(key, value, variance = null) {
  return (0, validateNode_1.default)({
    type: "ObjectTypeProperty",
    key,
    value,
    variance,
    kind: null,
    method: null,
    optional: null,
    proto: null,
    static: null
  });
}
function objectTypeSpreadProperty(argument) {
  return (0, validateNode_1.default)({
    type: "ObjectTypeSpreadProperty",
    argument
  });
}
function opaqueType(id, typeParameters = null, supertype = null, impltype) {
  return (0, validateNode_1.default)({
    type: "OpaqueType",
    id,
    typeParameters,
    supertype,
    impltype
  });
}
function qualifiedTypeIdentifier(id, qualification) {
  return (0, validateNode_1.default)({
    type: "QualifiedTypeIdentifier",
    id,
    qualification
  });
}
function stringLiteralTypeAnnotation(value) {
  return (0, validateNode_1.default)({
    type: "StringLiteralTypeAnnotation",
    value
  });
}
function stringTypeAnnotation() {
  return {
    type: "StringTypeAnnotation"
  };
}
function symbolTypeAnnotation() {
  return {
    type: "SymbolTypeAnnotation"
  };
}
function thisTypeAnnotation() {
  return {
    type: "ThisTypeAnnotation"
  };
}
function tupleTypeAnnotation(types) {
  return (0, validateNode_1.default)({
    type: "TupleTypeAnnotation",
    types
  });
}
function typeofTypeAnnotation(argument) {
  return (0, validateNode_1.default)({
    type: "TypeofTypeAnnotation",
    argument
  });
}
function typeAlias(id, typeParameters = null, right) {
  return (0, validateNode_1.default)({
    type: "TypeAlias",
    id,
    typeParameters,
    right
  });
}
function typeAnnotation(typeAnnotation) {
  return (0, validateNode_1.default)({
    type: "TypeAnnotation",
    typeAnnotation
  });
}
function typeCastExpression(expression, typeAnnotation) {
  return (0, validateNode_1.default)({
    type: "TypeCastExpression",
    expression,
    typeAnnotation
  });
}
function typeParameter(bound = null, _default = null, variance = null) {
  return (0, validateNode_1.default)({
    type: "TypeParameter",
    bound,
    default: _default,
    variance,
    name: null
  });
}
function typeParameterDeclaration(params) {
  return (0, validateNode_1.default)({
    type: "TypeParameterDeclaration",
    params
  });
}
function typeParameterInstantiation(params) {
  return (0, validateNode_1.default)({
    type: "TypeParameterInstantiation",
    params
  });
}
function unionTypeAnnotation(types) {
  return (0, validateNode_1.default)({
    type: "UnionTypeAnnotation",
    types
  });
}
function variance(kind) {
  return (0, validateNode_1.default)({
    type: "Variance",
    kind
  });
}
function voidTypeAnnotation() {
  return {
    type: "VoidTypeAnnotation"
  };
}
function enumDeclaration(id, body) {
  return (0, validateNode_1.default)({
    type: "EnumDeclaration",
    id,
    body
  });
}
function enumBooleanBody(members) {
  return (0, validateNode_1.default)({
    type: "EnumBooleanBody",
    members,
    explicitType: null,
    hasUnknownMembers: null
  });
}
function enumNumberBody(members) {
  return (0, validateNode_1.default)({
    type: "EnumNumberBody",
    members,
    explicitType: null,
    hasUnknownMembers: null
  });
}
function enumStringBody(members) {
  return (0, validateNode_1.default)({
    type: "EnumStringBody",
    members,
    explicitType: null,
    hasUnknownMembers: null
  });
}
function enumSymbolBody(members) {
  return (0, validateNode_1.default)({
    type: "EnumSymbolBody",
    members,
    hasUnknownMembers: null
  });
}
function enumBooleanMember(id) {
  return (0, validateNode_1.default)({
    type: "EnumBooleanMember",
    id,
    init: null
  });
}
function enumNumberMember(id, init) {
  return (0, validateNode_1.default)({
    type: "EnumNumberMember",
    id,
    init
  });
}
function enumStringMember(id, init) {
  return (0, validateNode_1.default)({
    type: "EnumStringMember",
    id,
    init
  });
}
function enumDefaultedMember(id) {
  return (0, validateNode_1.default)({
    type: "EnumDefaultedMember",
    id
  });
}
function indexedAccessType(objectType, indexType) {
  return (0, validateNode_1.default)({
    type: "IndexedAccessType",
    objectType,
    indexType
  });
}
function optionalIndexedAccessType(objectType, indexType) {
  return (0, validateNode_1.default)({
    type: "OptionalIndexedAccessType",
    objectType,
    indexType,
    optional: null
  });
}
function jsxAttribute(name, value = null) {
  return (0, validateNode_1.default)({
    type: "JSXAttribute",
    name,
    value
  });
}
function jsxClosingElement(name) {
  return (0, validateNode_1.default)({
    type: "JSXClosingElement",
    name
  });
}
function jsxElement(openingElement, closingElement = null, children, selfClosing = null) {
  return (0, validateNode_1.default)({
    type: "JSXElement",
    openingElement,
    closingElement,
    children,
    selfClosing
  });
}
function jsxEmptyExpression() {
  return {
    type: "JSXEmptyExpression"
  };
}
function jsxExpressionContainer(expression) {
  return (0, validateNode_1.default)({
    type: "JSXExpressionContainer",
    expression
  });
}
function jsxSpreadChild(expression) {
  return (0, validateNode_1.default)({
    type: "JSXSpreadChild",
    expression
  });
}
function jsxIdentifier(name) {
  return (0, validateNode_1.default)({
    type: "JSXIdentifier",
    name
  });
}
function jsxMemberExpression(object, property) {
  return (0, validateNode_1.default)({
    type: "JSXMemberExpression",
    object,
    property
  });
}
function jsxNamespacedName(namespace, name) {
  return (0, validateNode_1.default)({
    type: "JSXNamespacedName",
    namespace,
    name
  });
}
function jsxOpeningElement(name, attributes, selfClosing = false) {
  return (0, validateNode_1.default)({
    type: "JSXOpeningElement",
    name,
    attributes,
    selfClosing
  });
}
function jsxSpreadAttribute(argument) {
  return (0, validateNode_1.default)({
    type: "JSXSpreadAttribute",
    argument
  });
}
function jsxText(value) {
  return (0, validateNode_1.default)({
    type: "JSXText",
    value
  });
}
function jsxFragment(openingFragment, closingFragment, children) {
  return (0, validateNode_1.default)({
    type: "JSXFragment",
    openingFragment,
    closingFragment,
    children
  });
}
function jsxOpeningFragment() {
  return {
    type: "JSXOpeningFragment"
  };
}
function jsxClosingFragment() {
  return {
    type: "JSXClosingFragment"
  };
}
function noop() {
  return {
    type: "Noop"
  };
}
function placeholder(expectedNode, name) {
  return (0, validateNode_1.default)({
    type: "Placeholder",
    expectedNode,
    name
  });
}
function v8IntrinsicIdentifier(name) {
  return (0, validateNode_1.default)({
    type: "V8IntrinsicIdentifier",
    name
  });
}
function argumentPlaceholder() {
  return {
    type: "ArgumentPlaceholder"
  };
}
function bindExpression(object, callee) {
  return (0, validateNode_1.default)({
    type: "BindExpression",
    object,
    callee
  });
}
function importAttribute(key, value) {
  return (0, validateNode_1.default)({
    type: "ImportAttribute",
    key,
    value
  });
}
function decorator(expression) {
  return (0, validateNode_1.default)({
    type: "Decorator",
    expression
  });
}
function doExpression(body, async = false) {
  return (0, validateNode_1.default)({
    type: "DoExpression",
    body,
    async
  });
}
function exportDefaultSpecifier(exported) {
  return (0, validateNode_1.default)({
    type: "ExportDefaultSpecifier",
    exported
  });
}
function recordExpression(properties) {
  return (0, validateNode_1.default)({
    type: "RecordExpression",
    properties
  });
}
function tupleExpression(elements = []) {
  return (0, validateNode_1.default)({
    type: "TupleExpression",
    elements
  });
}
function decimalLiteral(value) {
  return (0, validateNode_1.default)({
    type: "DecimalLiteral",
    value
  });
}
function moduleExpression(body) {
  return (0, validateNode_1.default)({
    type: "ModuleExpression",
    body
  });
}
function topicReference() {
  return {
    type: "TopicReference"
  };
}
function pipelineTopicExpression(expression) {
  return (0, validateNode_1.default)({
    type: "PipelineTopicExpression",
    expression
  });
}
function pipelineBareFunction(callee) {
  return (0, validateNode_1.default)({
    type: "PipelineBareFunction",
    callee
  });
}
function pipelinePrimaryTopicReference() {
  return {
    type: "PipelinePrimaryTopicReference"
  };
}
function tsParameterProperty(parameter) {
  return (0, validateNode_1.default)({
    type: "TSParameterProperty",
    parameter
  });
}
function tsDeclareFunction(id = null, typeParameters = null, params, returnType = null) {
  return (0, validateNode_1.default)({
    type: "TSDeclareFunction",
    id,
    typeParameters,
    params,
    returnType
  });
}
function tsDeclareMethod(decorators = null, key, typeParameters = null, params, returnType = null) {
  return (0, validateNode_1.default)({
    type: "TSDeclareMethod",
    decorators,
    key,
    typeParameters,
    params,
    returnType
  });
}
function tsQualifiedName(left, right) {
  return (0, validateNode_1.default)({
    type: "TSQualifiedName",
    left,
    right
  });
}
function tsCallSignatureDeclaration(typeParameters = null, parameters, typeAnnotation = null) {
  return (0, validateNode_1.default)({
    type: "TSCallSignatureDeclaration",
    typeParameters,
    parameters,
    typeAnnotation
  });
}
function tsConstructSignatureDeclaration(typeParameters = null, parameters, typeAnnotation = null) {
  return (0, validateNode_1.default)({
    type: "TSConstructSignatureDeclaration",
    typeParameters,
    parameters,
    typeAnnotation
  });
}
function tsPropertySignature(key, typeAnnotation = null) {
  return (0, validateNode_1.default)({
    type: "TSPropertySignature",
    key,
    typeAnnotation,
    kind: null
  });
}
function tsMethodSignature(key, typeParameters = null, parameters, typeAnnotation = null) {
  return (0, validateNode_1.default)({
    type: "TSMethodSignature",
    key,
    typeParameters,
    parameters,
    typeAnnotation,
    kind: null
  });
}
function tsIndexSignature(parameters, typeAnnotation = null) {
  return (0, validateNode_1.default)({
    type: "TSIndexSignature",
    parameters,
    typeAnnotation
  });
}
function tsAnyKeyword() {
  return {
    type: "TSAnyKeyword"
  };
}
function tsBooleanKeyword() {
  return {
    type: "TSBooleanKeyword"
  };
}
function tsBigIntKeyword() {
  return {
    type: "TSBigIntKeyword"
  };
}
function tsIntrinsicKeyword() {
  return {
    type: "TSIntrinsicKeyword"
  };
}
function tsNeverKeyword() {
  return {
    type: "TSNeverKeyword"
  };
}
function tsNullKeyword() {
  return {
    type: "TSNullKeyword"
  };
}
function tsNumberKeyword() {
  return {
    type: "TSNumberKeyword"
  };
}
function tsObjectKeyword() {
  return {
    type: "TSObjectKeyword"
  };
}
function tsStringKeyword() {
  return {
    type: "TSStringKeyword"
  };
}
function tsSymbolKeyword() {
  return {
    type: "TSSymbolKeyword"
  };
}
function tsUndefinedKeyword() {
  return {
    type: "TSUndefinedKeyword"
  };
}
function tsUnknownKeyword() {
  return {
    type: "TSUnknownKeyword"
  };
}
function tsVoidKeyword() {
  return {
    type: "TSVoidKeyword"
  };
}
function tsThisType() {
  return {
    type: "TSThisType"
  };
}
function tsFunctionType(typeParameters = null, parameters, typeAnnotation = null) {
  return (0, validateNode_1.default)({
    type: "TSFunctionType",
    typeParameters,
    parameters,
    typeAnnotation
  });
}
function tsConstructorType(typeParameters = null, parameters, typeAnnotation = null) {
  return (0, validateNode_1.default)({
    type: "TSConstructorType",
    typeParameters,
    parameters,
    typeAnnotation
  });
}
function tsTypeReference(typeName, typeParameters = null) {
  return (0, validateNode_1.default)({
    type: "TSTypeReference",
    typeName,
    typeParameters
  });
}
function tsTypePredicate(parameterName, typeAnnotation = null, asserts = null) {
  return (0, validateNode_1.default)({
    type: "TSTypePredicate",
    parameterName,
    typeAnnotation,
    asserts
  });
}
function tsTypeQuery(exprName, typeParameters = null) {
  return (0, validateNode_1.default)({
    type: "TSTypeQuery",
    exprName,
    typeParameters
  });
}
function tsTypeLiteral(members) {
  return (0, validateNode_1.default)({
    type: "TSTypeLiteral",
    members
  });
}
function tsArrayType(elementType) {
  return (0, validateNode_1.default)({
    type: "TSArrayType",
    elementType
  });
}
function tsTupleType(elementTypes) {
  return (0, validateNode_1.default)({
    type: "TSTupleType",
    elementTypes
  });
}
function tsOptionalType(typeAnnotation) {
  return (0, validateNode_1.default)({
    type: "TSOptionalType",
    typeAnnotation
  });
}
function tsRestType(typeAnnotation) {
  return (0, validateNode_1.default)({
    type: "TSRestType",
    typeAnnotation
  });
}
function tsNamedTupleMember(label, elementType, optional = false) {
  return (0, validateNode_1.default)({
    type: "TSNamedTupleMember",
    label,
    elementType,
    optional
  });
}
function tsUnionType(types) {
  return (0, validateNode_1.default)({
    type: "TSUnionType",
    types
  });
}
function tsIntersectionType(types) {
  return (0, validateNode_1.default)({
    type: "TSIntersectionType",
    types
  });
}
function tsConditionalType(checkType, extendsType, trueType, falseType) {
  return (0, validateNode_1.default)({
    type: "TSConditionalType",
    checkType,
    extendsType,
    trueType,
    falseType
  });
}
function tsInferType(typeParameter) {
  return (0, validateNode_1.default)({
    type: "TSInferType",
    typeParameter
  });
}
function tsParenthesizedType(typeAnnotation) {
  return (0, validateNode_1.default)({
    type: "TSParenthesizedType",
    typeAnnotation
  });
}
function tsTypeOperator(typeAnnotation) {
  return (0, validateNode_1.default)({
    type: "TSTypeOperator",
    typeAnnotation,
    operator: null
  });
}
function tsIndexedAccessType(objectType, indexType) {
  return (0, validateNode_1.default)({
    type: "TSIndexedAccessType",
    objectType,
    indexType
  });
}
function tsMappedType(typeParameter, typeAnnotation = null, nameType = null) {
  return (0, validateNode_1.default)({
    type: "TSMappedType",
    typeParameter,
    typeAnnotation,
    nameType
  });
}
function tsLiteralType(literal) {
  return (0, validateNode_1.default)({
    type: "TSLiteralType",
    literal
  });
}
function tsExpressionWithTypeArguments(expression, typeParameters = null) {
  return (0, validateNode_1.default)({
    type: "TSExpressionWithTypeArguments",
    expression,
    typeParameters
  });
}
function tsInterfaceDeclaration(id, typeParameters = null, _extends = null, body) {
  return (0, validateNode_1.default)({
    type: "TSInterfaceDeclaration",
    id,
    typeParameters,
    extends: _extends,
    body
  });
}
function tsInterfaceBody(body) {
  return (0, validateNode_1.default)({
    type: "TSInterfaceBody",
    body
  });
}
function tsTypeAliasDeclaration(id, typeParameters = null, typeAnnotation) {
  return (0, validateNode_1.default)({
    type: "TSTypeAliasDeclaration",
    id,
    typeParameters,
    typeAnnotation
  });
}
function tsInstantiationExpression(expression, typeParameters = null) {
  return (0, validateNode_1.default)({
    type: "TSInstantiationExpression",
    expression,
    typeParameters
  });
}
function tsAsExpression(expression, typeAnnotation) {
  return (0, validateNode_1.default)({
    type: "TSAsExpression",
    expression,
    typeAnnotation
  });
}
function tsSatisfiesExpression(expression, typeAnnotation) {
  return (0, validateNode_1.default)({
    type: "TSSatisfiesExpression",
    expression,
    typeAnnotation
  });
}
function tsTypeAssertion(typeAnnotation, expression) {
  return (0, validateNode_1.default)({
    type: "TSTypeAssertion",
    typeAnnotation,
    expression
  });
}
function tsEnumDeclaration(id, members) {
  return (0, validateNode_1.default)({
    type: "TSEnumDeclaration",
    id,
    members
  });
}
function tsEnumMember(id, initializer = null) {
  return (0, validateNode_1.default)({
    type: "TSEnumMember",
    id,
    initializer
  });
}
function tsModuleDeclaration(id, body) {
  return (0, validateNode_1.default)({
    type: "TSModuleDeclaration",
    id,
    body
  });
}
function tsModuleBlock(body) {
  return (0, validateNode_1.default)({
    type: "TSModuleBlock",
    body
  });
}
function tsImportType(argument, qualifier = null, typeParameters = null) {
  return (0, validateNode_1.default)({
    type: "TSImportType",
    argument,
    qualifier,
    typeParameters
  });
}
function tsImportEqualsDeclaration(id, moduleReference) {
  return (0, validateNode_1.default)({
    type: "TSImportEqualsDeclaration",
    id,
    moduleReference,
    isExport: null
  });
}
function tsExternalModuleReference(expression) {
  return (0, validateNode_1.default)({
    type: "TSExternalModuleReference",
    expression
  });
}
function tsNonNullExpression(expression) {
  return (0, validateNode_1.default)({
    type: "TSNonNullExpression",
    expression
  });
}
function tsExportAssignment(expression) {
  return (0, validateNode_1.default)({
    type: "TSExportAssignment",
    expression
  });
}
function tsNamespaceExportDeclaration(id) {
  return (0, validateNode_1.default)({
    type: "TSNamespaceExportDeclaration",
    id
  });
}
function tsTypeAnnotation(typeAnnotation) {
  return (0, validateNode_1.default)({
    type: "TSTypeAnnotation",
    typeAnnotation
  });
}
function tsTypeParameterInstantiation(params) {
  return (0, validateNode_1.default)({
    type: "TSTypeParameterInstantiation",
    params
  });
}
function tsTypeParameterDeclaration(params) {
  return (0, validateNode_1.default)({
    type: "TSTypeParameterDeclaration",
    params
  });
}
function tsTypeParameter(constraint = null, _default = null, name) {
  return (0, validateNode_1.default)({
    type: "TSTypeParameter",
    constraint,
    default: _default,
    name
  });
}
function NumberLiteral(value) {
  (0, deprecationWarning_1.default)("NumberLiteral", "NumericLiteral", "The node type ");
  return numericLiteral(value);
}
function RegexLiteral(pattern, flags = "") {
  (0, deprecationWarning_1.default)("RegexLiteral", "RegExpLiteral", "The node type ");
  return regExpLiteral(pattern, flags);
}
function RestProperty(argument) {
  (0, deprecationWarning_1.default)("RestProperty", "RestElement", "The node type ");
  return restElement(argument);
}
function SpreadProperty(argument) {
  (0, deprecationWarning_1.default)("SpreadProperty", "SpreadElement", "The node type ");
  return spreadElement(argument);
}


});

unwrapExports(generated$2);
generated$2.anyTypeAnnotation;
generated$2.argumentPlaceholder;
generated$2.arrayExpression;
generated$2.arrayPattern;
generated$2.arrayTypeAnnotation;
generated$2.arrowFunctionExpression;
generated$2.assignmentExpression;
generated$2.assignmentPattern;
generated$2.awaitExpression;
generated$2.bigIntLiteral;
generated$2.binaryExpression;
generated$2.bindExpression;
generated$2.blockStatement;
generated$2.booleanLiteral;
generated$2.booleanLiteralTypeAnnotation;
generated$2.booleanTypeAnnotation;
generated$2.breakStatement;
generated$2.callExpression;
generated$2.catchClause;
generated$2.classAccessorProperty;
generated$2.classBody;
generated$2.classDeclaration;
generated$2.classExpression;
generated$2.classImplements;
generated$2.classMethod;
generated$2.classPrivateMethod;
generated$2.classPrivateProperty;
generated$2.classProperty;
generated$2.conditionalExpression;
generated$2.continueStatement;
generated$2.debuggerStatement;
generated$2.decimalLiteral;
generated$2.declareClass;
generated$2.declareExportAllDeclaration;
generated$2.declareExportDeclaration;
generated$2.declareFunction;
generated$2.declareInterface;
generated$2.declareModule;
generated$2.declareModuleExports;
generated$2.declareOpaqueType;
generated$2.declareTypeAlias;
generated$2.declareVariable;
generated$2.declaredPredicate;
generated$2.decorator;
generated$2.directive;
generated$2.directiveLiteral;
generated$2.doExpression;
generated$2.doWhileStatement;
generated$2.emptyStatement;
generated$2.emptyTypeAnnotation;
generated$2.enumBooleanBody;
generated$2.enumBooleanMember;
generated$2.enumDeclaration;
generated$2.enumDefaultedMember;
generated$2.enumNumberBody;
generated$2.enumNumberMember;
generated$2.enumStringBody;
generated$2.enumStringMember;
generated$2.enumSymbolBody;
generated$2.existsTypeAnnotation;
generated$2.exportAllDeclaration;
generated$2.exportDefaultDeclaration;
generated$2.exportDefaultSpecifier;
generated$2.exportNamedDeclaration;
generated$2.exportNamespaceSpecifier;
generated$2.exportSpecifier;
generated$2.expressionStatement;
generated$2.file;
generated$2.forInStatement;
generated$2.forOfStatement;
generated$2.forStatement;
generated$2.functionDeclaration;
generated$2.functionExpression;
generated$2.functionTypeAnnotation;
generated$2.functionTypeParam;
generated$2.genericTypeAnnotation;
generated$2.identifier;
generated$2.ifStatement;
generated$2.importAttribute;
generated$2.importDeclaration;
generated$2.importDefaultSpecifier;
generated$2.importExpression;
generated$2.importNamespaceSpecifier;
generated$2.importSpecifier;
generated$2.indexedAccessType;
generated$2.inferredPredicate;
generated$2.interfaceDeclaration;
generated$2.interfaceExtends;
generated$2.interfaceTypeAnnotation;
generated$2.interpreterDirective;
generated$2.intersectionTypeAnnotation;
generated$2.jSXAttribute;
generated$2.jsxAttribute;
generated$2.jSXClosingElement;
generated$2.jsxClosingElement;
generated$2.jSXClosingFragment;
generated$2.jsxClosingFragment;
generated$2.jSXElement;
generated$2.jsxElement;
generated$2.jSXEmptyExpression;
generated$2.jsxEmptyExpression;
generated$2.jSXExpressionContainer;
generated$2.jsxExpressionContainer;
generated$2.jSXFragment;
generated$2.jsxFragment;
generated$2.jSXIdentifier;
generated$2.jsxIdentifier;
generated$2.jSXMemberExpression;
generated$2.jsxMemberExpression;
generated$2.jSXNamespacedName;
generated$2.jsxNamespacedName;
generated$2.jSXOpeningElement;
generated$2.jsxOpeningElement;
generated$2.jSXOpeningFragment;
generated$2.jsxOpeningFragment;
generated$2.jSXSpreadAttribute;
generated$2.jsxSpreadAttribute;
generated$2.jSXSpreadChild;
generated$2.jsxSpreadChild;
generated$2.jSXText;
generated$2.jsxText;
generated$2.labeledStatement;
generated$2.logicalExpression;
generated$2.memberExpression;
generated$2.metaProperty;
generated$2.mixedTypeAnnotation;
generated$2.moduleExpression;
generated$2.newExpression;
generated$2.noop;
generated$2.nullLiteral;
generated$2.nullLiteralTypeAnnotation;
generated$2.nullableTypeAnnotation;
generated$2.numberLiteral;
generated$2.numberLiteralTypeAnnotation;
generated$2.numberTypeAnnotation;
generated$2.numericLiteral;
generated$2.objectExpression;
generated$2.objectMethod;
generated$2.objectPattern;
generated$2.objectProperty;
generated$2.objectTypeAnnotation;
generated$2.objectTypeCallProperty;
generated$2.objectTypeIndexer;
generated$2.objectTypeInternalSlot;
generated$2.objectTypeProperty;
generated$2.objectTypeSpreadProperty;
generated$2.opaqueType;
generated$2.optionalCallExpression;
generated$2.optionalIndexedAccessType;
generated$2.optionalMemberExpression;
generated$2.parenthesizedExpression;
generated$2.pipelineBareFunction;
generated$2.pipelinePrimaryTopicReference;
generated$2.pipelineTopicExpression;
generated$2.placeholder;
generated$2.privateName;
generated$2.program;
generated$2.qualifiedTypeIdentifier;
generated$2.recordExpression;
generated$2.regExpLiteral;
generated$2.regexLiteral;
generated$2.restElement;
generated$2.restProperty;
generated$2.returnStatement;
generated$2.sequenceExpression;
generated$2.spreadElement;
generated$2.spreadProperty;
generated$2.staticBlock;
generated$2.stringLiteral;
generated$2.stringLiteralTypeAnnotation;
generated$2.stringTypeAnnotation;
generated$2.switchCase;
generated$2.switchStatement;
generated$2.symbolTypeAnnotation;
generated$2.taggedTemplateExpression;
generated$2.templateElement;
generated$2.templateLiteral;
generated$2.thisExpression;
generated$2.thisTypeAnnotation;
generated$2.throwStatement;
generated$2.topicReference;
generated$2.tryStatement;
generated$2.tSAnyKeyword;
generated$2.tsAnyKeyword;
generated$2.tSArrayType;
generated$2.tsArrayType;
generated$2.tSAsExpression;
generated$2.tsAsExpression;
generated$2.tSBigIntKeyword;
generated$2.tsBigIntKeyword;
generated$2.tSBooleanKeyword;
generated$2.tsBooleanKeyword;
generated$2.tSCallSignatureDeclaration;
generated$2.tsCallSignatureDeclaration;
generated$2.tSConditionalType;
generated$2.tsConditionalType;
generated$2.tSConstructSignatureDeclaration;
generated$2.tsConstructSignatureDeclaration;
generated$2.tSConstructorType;
generated$2.tsConstructorType;
generated$2.tSDeclareFunction;
generated$2.tsDeclareFunction;
generated$2.tSDeclareMethod;
generated$2.tsDeclareMethod;
generated$2.tSEnumDeclaration;
generated$2.tsEnumDeclaration;
generated$2.tSEnumMember;
generated$2.tsEnumMember;
generated$2.tSExportAssignment;
generated$2.tsExportAssignment;
generated$2.tSExpressionWithTypeArguments;
generated$2.tsExpressionWithTypeArguments;
generated$2.tSExternalModuleReference;
generated$2.tsExternalModuleReference;
generated$2.tSFunctionType;
generated$2.tsFunctionType;
generated$2.tSImportEqualsDeclaration;
generated$2.tsImportEqualsDeclaration;
generated$2.tSImportType;
generated$2.tsImportType;
generated$2.tSIndexSignature;
generated$2.tsIndexSignature;
generated$2.tSIndexedAccessType;
generated$2.tsIndexedAccessType;
generated$2.tSInferType;
generated$2.tsInferType;
generated$2.tSInstantiationExpression;
generated$2.tsInstantiationExpression;
generated$2.tSInterfaceBody;
generated$2.tsInterfaceBody;
generated$2.tSInterfaceDeclaration;
generated$2.tsInterfaceDeclaration;
generated$2.tSIntersectionType;
generated$2.tsIntersectionType;
generated$2.tSIntrinsicKeyword;
generated$2.tsIntrinsicKeyword;
generated$2.tSLiteralType;
generated$2.tsLiteralType;
generated$2.tSMappedType;
generated$2.tsMappedType;
generated$2.tSMethodSignature;
generated$2.tsMethodSignature;
generated$2.tSModuleBlock;
generated$2.tsModuleBlock;
generated$2.tSModuleDeclaration;
generated$2.tsModuleDeclaration;
generated$2.tSNamedTupleMember;
generated$2.tsNamedTupleMember;
generated$2.tSNamespaceExportDeclaration;
generated$2.tsNamespaceExportDeclaration;
generated$2.tSNeverKeyword;
generated$2.tsNeverKeyword;
generated$2.tSNonNullExpression;
generated$2.tsNonNullExpression;
generated$2.tSNullKeyword;
generated$2.tsNullKeyword;
generated$2.tSNumberKeyword;
generated$2.tsNumberKeyword;
generated$2.tSObjectKeyword;
generated$2.tsObjectKeyword;
generated$2.tSOptionalType;
generated$2.tsOptionalType;
generated$2.tSParameterProperty;
generated$2.tsParameterProperty;
generated$2.tSParenthesizedType;
generated$2.tsParenthesizedType;
generated$2.tSPropertySignature;
generated$2.tsPropertySignature;
generated$2.tSQualifiedName;
generated$2.tsQualifiedName;
generated$2.tSRestType;
generated$2.tsRestType;
generated$2.tSSatisfiesExpression;
generated$2.tsSatisfiesExpression;
generated$2.tSStringKeyword;
generated$2.tsStringKeyword;
generated$2.tSSymbolKeyword;
generated$2.tsSymbolKeyword;
generated$2.tSThisType;
generated$2.tsThisType;
generated$2.tSTupleType;
generated$2.tsTupleType;
generated$2.tSTypeAliasDeclaration;
generated$2.tsTypeAliasDeclaration;
generated$2.tSTypeAnnotation;
generated$2.tsTypeAnnotation;
generated$2.tSTypeAssertion;
generated$2.tsTypeAssertion;
generated$2.tSTypeLiteral;
generated$2.tsTypeLiteral;
generated$2.tSTypeOperator;
generated$2.tsTypeOperator;
generated$2.tSTypeParameter;
generated$2.tsTypeParameter;
generated$2.tSTypeParameterDeclaration;
generated$2.tsTypeParameterDeclaration;
generated$2.tSTypeParameterInstantiation;
generated$2.tsTypeParameterInstantiation;
generated$2.tSTypePredicate;
generated$2.tsTypePredicate;
generated$2.tSTypeQuery;
generated$2.tsTypeQuery;
generated$2.tSTypeReference;
generated$2.tsTypeReference;
generated$2.tSUndefinedKeyword;
generated$2.tsUndefinedKeyword;
generated$2.tSUnionType;
generated$2.tsUnionType;
generated$2.tSUnknownKeyword;
generated$2.tsUnknownKeyword;
generated$2.tSVoidKeyword;
generated$2.tsVoidKeyword;
generated$2.tupleExpression;
generated$2.tupleTypeAnnotation;
generated$2.typeAlias;
generated$2.typeAnnotation;
generated$2.typeCastExpression;
generated$2.typeParameter;
generated$2.typeParameterDeclaration;
generated$2.typeParameterInstantiation;
generated$2.typeofTypeAnnotation;
generated$2.unaryExpression;
generated$2.unionTypeAnnotation;
generated$2.updateExpression;
generated$2.v8IntrinsicIdentifier;
generated$2.variableDeclaration;
generated$2.variableDeclarator;
generated$2.variance;
generated$2.voidTypeAnnotation;
generated$2.whileStatement;
generated$2.withStatement;
generated$2.yieldExpression;

var cleanJSXElementLiteralChild_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cleanJSXElementLiteralChild;


function cleanJSXElementLiteralChild(child, args) {
  const lines = child.value.split(/\r\n|\n|\r/);
  let lastNonEmptyLine = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/[^ \t]/)) {
      lastNonEmptyLine = i;
    }
  }
  let str = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isFirstLine = i === 0;
    const isLastLine = i === lines.length - 1;
    const isLastNonEmptyLine = i === lastNonEmptyLine;
    let trimmedLine = line.replace(/\t/g, " ");
    if (!isFirstLine) {
      trimmedLine = trimmedLine.replace(/^[ ]+/, "");
    }
    if (!isLastLine) {
      trimmedLine = trimmedLine.replace(/[ ]+$/, "");
    }
    if (trimmedLine) {
      if (!isLastNonEmptyLine) {
        trimmedLine += " ";
      }
      str += trimmedLine;
    }
  }
  if (str) args.push((0, lib.inherits)((0, generated$2.stringLiteral)(str), child));
}


});

unwrapExports(cleanJSXElementLiteralChild_1);

var buildChildren_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildChildren;


function buildChildren(node) {
  const elements = [];
  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i];
    if ((0, generated$3.isJSXText)(child)) {
      (0, cleanJSXElementLiteralChild_1.default)(child, elements);
      continue;
    }
    if ((0, generated$3.isJSXExpressionContainer)(child)) child = child.expression;
    if ((0, generated$3.isJSXEmptyExpression)(child)) continue;
    elements.push(child);
  }
  return elements;
}


});

unwrapExports(buildChildren_1);

var isNode_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNode;

function isNode(node) {
  return !!(node && definitions.VISITOR_KEYS[node.type]);
}


});

unwrapExports(isNode_1);

var assertNode_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assertNode;

function assertNode(node) {
  if (!(0, isNode_1.default)(node)) {
    var _node$type;
    const type = (_node$type = node == null ? void 0 : node.type) != null ? _node$type : JSON.stringify(node);
    throw new TypeError(`Not a valid node of type "${type}"`);
  }
}


});

unwrapExports(assertNode_1);

var generated$1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertAccessor = assertAccessor;
exports.assertAnyTypeAnnotation = assertAnyTypeAnnotation;
exports.assertArgumentPlaceholder = assertArgumentPlaceholder;
exports.assertArrayExpression = assertArrayExpression;
exports.assertArrayPattern = assertArrayPattern;
exports.assertArrayTypeAnnotation = assertArrayTypeAnnotation;
exports.assertArrowFunctionExpression = assertArrowFunctionExpression;
exports.assertAssignmentExpression = assertAssignmentExpression;
exports.assertAssignmentPattern = assertAssignmentPattern;
exports.assertAwaitExpression = assertAwaitExpression;
exports.assertBigIntLiteral = assertBigIntLiteral;
exports.assertBinary = assertBinary;
exports.assertBinaryExpression = assertBinaryExpression;
exports.assertBindExpression = assertBindExpression;
exports.assertBlock = assertBlock;
exports.assertBlockParent = assertBlockParent;
exports.assertBlockStatement = assertBlockStatement;
exports.assertBooleanLiteral = assertBooleanLiteral;
exports.assertBooleanLiteralTypeAnnotation = assertBooleanLiteralTypeAnnotation;
exports.assertBooleanTypeAnnotation = assertBooleanTypeAnnotation;
exports.assertBreakStatement = assertBreakStatement;
exports.assertCallExpression = assertCallExpression;
exports.assertCatchClause = assertCatchClause;
exports.assertClass = assertClass;
exports.assertClassAccessorProperty = assertClassAccessorProperty;
exports.assertClassBody = assertClassBody;
exports.assertClassDeclaration = assertClassDeclaration;
exports.assertClassExpression = assertClassExpression;
exports.assertClassImplements = assertClassImplements;
exports.assertClassMethod = assertClassMethod;
exports.assertClassPrivateMethod = assertClassPrivateMethod;
exports.assertClassPrivateProperty = assertClassPrivateProperty;
exports.assertClassProperty = assertClassProperty;
exports.assertCompletionStatement = assertCompletionStatement;
exports.assertConditional = assertConditional;
exports.assertConditionalExpression = assertConditionalExpression;
exports.assertContinueStatement = assertContinueStatement;
exports.assertDebuggerStatement = assertDebuggerStatement;
exports.assertDecimalLiteral = assertDecimalLiteral;
exports.assertDeclaration = assertDeclaration;
exports.assertDeclareClass = assertDeclareClass;
exports.assertDeclareExportAllDeclaration = assertDeclareExportAllDeclaration;
exports.assertDeclareExportDeclaration = assertDeclareExportDeclaration;
exports.assertDeclareFunction = assertDeclareFunction;
exports.assertDeclareInterface = assertDeclareInterface;
exports.assertDeclareModule = assertDeclareModule;
exports.assertDeclareModuleExports = assertDeclareModuleExports;
exports.assertDeclareOpaqueType = assertDeclareOpaqueType;
exports.assertDeclareTypeAlias = assertDeclareTypeAlias;
exports.assertDeclareVariable = assertDeclareVariable;
exports.assertDeclaredPredicate = assertDeclaredPredicate;
exports.assertDecorator = assertDecorator;
exports.assertDirective = assertDirective;
exports.assertDirectiveLiteral = assertDirectiveLiteral;
exports.assertDoExpression = assertDoExpression;
exports.assertDoWhileStatement = assertDoWhileStatement;
exports.assertEmptyStatement = assertEmptyStatement;
exports.assertEmptyTypeAnnotation = assertEmptyTypeAnnotation;
exports.assertEnumBody = assertEnumBody;
exports.assertEnumBooleanBody = assertEnumBooleanBody;
exports.assertEnumBooleanMember = assertEnumBooleanMember;
exports.assertEnumDeclaration = assertEnumDeclaration;
exports.assertEnumDefaultedMember = assertEnumDefaultedMember;
exports.assertEnumMember = assertEnumMember;
exports.assertEnumNumberBody = assertEnumNumberBody;
exports.assertEnumNumberMember = assertEnumNumberMember;
exports.assertEnumStringBody = assertEnumStringBody;
exports.assertEnumStringMember = assertEnumStringMember;
exports.assertEnumSymbolBody = assertEnumSymbolBody;
exports.assertExistsTypeAnnotation = assertExistsTypeAnnotation;
exports.assertExportAllDeclaration = assertExportAllDeclaration;
exports.assertExportDeclaration = assertExportDeclaration;
exports.assertExportDefaultDeclaration = assertExportDefaultDeclaration;
exports.assertExportDefaultSpecifier = assertExportDefaultSpecifier;
exports.assertExportNamedDeclaration = assertExportNamedDeclaration;
exports.assertExportNamespaceSpecifier = assertExportNamespaceSpecifier;
exports.assertExportSpecifier = assertExportSpecifier;
exports.assertExpression = assertExpression;
exports.assertExpressionStatement = assertExpressionStatement;
exports.assertExpressionWrapper = assertExpressionWrapper;
exports.assertFile = assertFile;
exports.assertFlow = assertFlow;
exports.assertFlowBaseAnnotation = assertFlowBaseAnnotation;
exports.assertFlowDeclaration = assertFlowDeclaration;
exports.assertFlowPredicate = assertFlowPredicate;
exports.assertFlowType = assertFlowType;
exports.assertFor = assertFor;
exports.assertForInStatement = assertForInStatement;
exports.assertForOfStatement = assertForOfStatement;
exports.assertForStatement = assertForStatement;
exports.assertForXStatement = assertForXStatement;
exports.assertFunction = assertFunction;
exports.assertFunctionDeclaration = assertFunctionDeclaration;
exports.assertFunctionExpression = assertFunctionExpression;
exports.assertFunctionParent = assertFunctionParent;
exports.assertFunctionTypeAnnotation = assertFunctionTypeAnnotation;
exports.assertFunctionTypeParam = assertFunctionTypeParam;
exports.assertGenericTypeAnnotation = assertGenericTypeAnnotation;
exports.assertIdentifier = assertIdentifier;
exports.assertIfStatement = assertIfStatement;
exports.assertImmutable = assertImmutable;
exports.assertImport = assertImport;
exports.assertImportAttribute = assertImportAttribute;
exports.assertImportDeclaration = assertImportDeclaration;
exports.assertImportDefaultSpecifier = assertImportDefaultSpecifier;
exports.assertImportExpression = assertImportExpression;
exports.assertImportNamespaceSpecifier = assertImportNamespaceSpecifier;
exports.assertImportOrExportDeclaration = assertImportOrExportDeclaration;
exports.assertImportSpecifier = assertImportSpecifier;
exports.assertIndexedAccessType = assertIndexedAccessType;
exports.assertInferredPredicate = assertInferredPredicate;
exports.assertInterfaceDeclaration = assertInterfaceDeclaration;
exports.assertInterfaceExtends = assertInterfaceExtends;
exports.assertInterfaceTypeAnnotation = assertInterfaceTypeAnnotation;
exports.assertInterpreterDirective = assertInterpreterDirective;
exports.assertIntersectionTypeAnnotation = assertIntersectionTypeAnnotation;
exports.assertJSX = assertJSX;
exports.assertJSXAttribute = assertJSXAttribute;
exports.assertJSXClosingElement = assertJSXClosingElement;
exports.assertJSXClosingFragment = assertJSXClosingFragment;
exports.assertJSXElement = assertJSXElement;
exports.assertJSXEmptyExpression = assertJSXEmptyExpression;
exports.assertJSXExpressionContainer = assertJSXExpressionContainer;
exports.assertJSXFragment = assertJSXFragment;
exports.assertJSXIdentifier = assertJSXIdentifier;
exports.assertJSXMemberExpression = assertJSXMemberExpression;
exports.assertJSXNamespacedName = assertJSXNamespacedName;
exports.assertJSXOpeningElement = assertJSXOpeningElement;
exports.assertJSXOpeningFragment = assertJSXOpeningFragment;
exports.assertJSXSpreadAttribute = assertJSXSpreadAttribute;
exports.assertJSXSpreadChild = assertJSXSpreadChild;
exports.assertJSXText = assertJSXText;
exports.assertLVal = assertLVal;
exports.assertLabeledStatement = assertLabeledStatement;
exports.assertLiteral = assertLiteral;
exports.assertLogicalExpression = assertLogicalExpression;
exports.assertLoop = assertLoop;
exports.assertMemberExpression = assertMemberExpression;
exports.assertMetaProperty = assertMetaProperty;
exports.assertMethod = assertMethod;
exports.assertMiscellaneous = assertMiscellaneous;
exports.assertMixedTypeAnnotation = assertMixedTypeAnnotation;
exports.assertModuleDeclaration = assertModuleDeclaration;
exports.assertModuleExpression = assertModuleExpression;
exports.assertModuleSpecifier = assertModuleSpecifier;
exports.assertNewExpression = assertNewExpression;
exports.assertNoop = assertNoop;
exports.assertNullLiteral = assertNullLiteral;
exports.assertNullLiteralTypeAnnotation = assertNullLiteralTypeAnnotation;
exports.assertNullableTypeAnnotation = assertNullableTypeAnnotation;
exports.assertNumberLiteral = assertNumberLiteral;
exports.assertNumberLiteralTypeAnnotation = assertNumberLiteralTypeAnnotation;
exports.assertNumberTypeAnnotation = assertNumberTypeAnnotation;
exports.assertNumericLiteral = assertNumericLiteral;
exports.assertObjectExpression = assertObjectExpression;
exports.assertObjectMember = assertObjectMember;
exports.assertObjectMethod = assertObjectMethod;
exports.assertObjectPattern = assertObjectPattern;
exports.assertObjectProperty = assertObjectProperty;
exports.assertObjectTypeAnnotation = assertObjectTypeAnnotation;
exports.assertObjectTypeCallProperty = assertObjectTypeCallProperty;
exports.assertObjectTypeIndexer = assertObjectTypeIndexer;
exports.assertObjectTypeInternalSlot = assertObjectTypeInternalSlot;
exports.assertObjectTypeProperty = assertObjectTypeProperty;
exports.assertObjectTypeSpreadProperty = assertObjectTypeSpreadProperty;
exports.assertOpaqueType = assertOpaqueType;
exports.assertOptionalCallExpression = assertOptionalCallExpression;
exports.assertOptionalIndexedAccessType = assertOptionalIndexedAccessType;
exports.assertOptionalMemberExpression = assertOptionalMemberExpression;
exports.assertParenthesizedExpression = assertParenthesizedExpression;
exports.assertPattern = assertPattern;
exports.assertPatternLike = assertPatternLike;
exports.assertPipelineBareFunction = assertPipelineBareFunction;
exports.assertPipelinePrimaryTopicReference = assertPipelinePrimaryTopicReference;
exports.assertPipelineTopicExpression = assertPipelineTopicExpression;
exports.assertPlaceholder = assertPlaceholder;
exports.assertPrivate = assertPrivate;
exports.assertPrivateName = assertPrivateName;
exports.assertProgram = assertProgram;
exports.assertProperty = assertProperty;
exports.assertPureish = assertPureish;
exports.assertQualifiedTypeIdentifier = assertQualifiedTypeIdentifier;
exports.assertRecordExpression = assertRecordExpression;
exports.assertRegExpLiteral = assertRegExpLiteral;
exports.assertRegexLiteral = assertRegexLiteral;
exports.assertRestElement = assertRestElement;
exports.assertRestProperty = assertRestProperty;
exports.assertReturnStatement = assertReturnStatement;
exports.assertScopable = assertScopable;
exports.assertSequenceExpression = assertSequenceExpression;
exports.assertSpreadElement = assertSpreadElement;
exports.assertSpreadProperty = assertSpreadProperty;
exports.assertStandardized = assertStandardized;
exports.assertStatement = assertStatement;
exports.assertStaticBlock = assertStaticBlock;
exports.assertStringLiteral = assertStringLiteral;
exports.assertStringLiteralTypeAnnotation = assertStringLiteralTypeAnnotation;
exports.assertStringTypeAnnotation = assertStringTypeAnnotation;
exports.assertSuper = assertSuper;
exports.assertSwitchCase = assertSwitchCase;
exports.assertSwitchStatement = assertSwitchStatement;
exports.assertSymbolTypeAnnotation = assertSymbolTypeAnnotation;
exports.assertTSAnyKeyword = assertTSAnyKeyword;
exports.assertTSArrayType = assertTSArrayType;
exports.assertTSAsExpression = assertTSAsExpression;
exports.assertTSBaseType = assertTSBaseType;
exports.assertTSBigIntKeyword = assertTSBigIntKeyword;
exports.assertTSBooleanKeyword = assertTSBooleanKeyword;
exports.assertTSCallSignatureDeclaration = assertTSCallSignatureDeclaration;
exports.assertTSConditionalType = assertTSConditionalType;
exports.assertTSConstructSignatureDeclaration = assertTSConstructSignatureDeclaration;
exports.assertTSConstructorType = assertTSConstructorType;
exports.assertTSDeclareFunction = assertTSDeclareFunction;
exports.assertTSDeclareMethod = assertTSDeclareMethod;
exports.assertTSEntityName = assertTSEntityName;
exports.assertTSEnumDeclaration = assertTSEnumDeclaration;
exports.assertTSEnumMember = assertTSEnumMember;
exports.assertTSExportAssignment = assertTSExportAssignment;
exports.assertTSExpressionWithTypeArguments = assertTSExpressionWithTypeArguments;
exports.assertTSExternalModuleReference = assertTSExternalModuleReference;
exports.assertTSFunctionType = assertTSFunctionType;
exports.assertTSImportEqualsDeclaration = assertTSImportEqualsDeclaration;
exports.assertTSImportType = assertTSImportType;
exports.assertTSIndexSignature = assertTSIndexSignature;
exports.assertTSIndexedAccessType = assertTSIndexedAccessType;
exports.assertTSInferType = assertTSInferType;
exports.assertTSInstantiationExpression = assertTSInstantiationExpression;
exports.assertTSInterfaceBody = assertTSInterfaceBody;
exports.assertTSInterfaceDeclaration = assertTSInterfaceDeclaration;
exports.assertTSIntersectionType = assertTSIntersectionType;
exports.assertTSIntrinsicKeyword = assertTSIntrinsicKeyword;
exports.assertTSLiteralType = assertTSLiteralType;
exports.assertTSMappedType = assertTSMappedType;
exports.assertTSMethodSignature = assertTSMethodSignature;
exports.assertTSModuleBlock = assertTSModuleBlock;
exports.assertTSModuleDeclaration = assertTSModuleDeclaration;
exports.assertTSNamedTupleMember = assertTSNamedTupleMember;
exports.assertTSNamespaceExportDeclaration = assertTSNamespaceExportDeclaration;
exports.assertTSNeverKeyword = assertTSNeverKeyword;
exports.assertTSNonNullExpression = assertTSNonNullExpression;
exports.assertTSNullKeyword = assertTSNullKeyword;
exports.assertTSNumberKeyword = assertTSNumberKeyword;
exports.assertTSObjectKeyword = assertTSObjectKeyword;
exports.assertTSOptionalType = assertTSOptionalType;
exports.assertTSParameterProperty = assertTSParameterProperty;
exports.assertTSParenthesizedType = assertTSParenthesizedType;
exports.assertTSPropertySignature = assertTSPropertySignature;
exports.assertTSQualifiedName = assertTSQualifiedName;
exports.assertTSRestType = assertTSRestType;
exports.assertTSSatisfiesExpression = assertTSSatisfiesExpression;
exports.assertTSStringKeyword = assertTSStringKeyword;
exports.assertTSSymbolKeyword = assertTSSymbolKeyword;
exports.assertTSThisType = assertTSThisType;
exports.assertTSTupleType = assertTSTupleType;
exports.assertTSType = assertTSType;
exports.assertTSTypeAliasDeclaration = assertTSTypeAliasDeclaration;
exports.assertTSTypeAnnotation = assertTSTypeAnnotation;
exports.assertTSTypeAssertion = assertTSTypeAssertion;
exports.assertTSTypeElement = assertTSTypeElement;
exports.assertTSTypeLiteral = assertTSTypeLiteral;
exports.assertTSTypeOperator = assertTSTypeOperator;
exports.assertTSTypeParameter = assertTSTypeParameter;
exports.assertTSTypeParameterDeclaration = assertTSTypeParameterDeclaration;
exports.assertTSTypeParameterInstantiation = assertTSTypeParameterInstantiation;
exports.assertTSTypePredicate = assertTSTypePredicate;
exports.assertTSTypeQuery = assertTSTypeQuery;
exports.assertTSTypeReference = assertTSTypeReference;
exports.assertTSUndefinedKeyword = assertTSUndefinedKeyword;
exports.assertTSUnionType = assertTSUnionType;
exports.assertTSUnknownKeyword = assertTSUnknownKeyword;
exports.assertTSVoidKeyword = assertTSVoidKeyword;
exports.assertTaggedTemplateExpression = assertTaggedTemplateExpression;
exports.assertTemplateElement = assertTemplateElement;
exports.assertTemplateLiteral = assertTemplateLiteral;
exports.assertTerminatorless = assertTerminatorless;
exports.assertThisExpression = assertThisExpression;
exports.assertThisTypeAnnotation = assertThisTypeAnnotation;
exports.assertThrowStatement = assertThrowStatement;
exports.assertTopicReference = assertTopicReference;
exports.assertTryStatement = assertTryStatement;
exports.assertTupleExpression = assertTupleExpression;
exports.assertTupleTypeAnnotation = assertTupleTypeAnnotation;
exports.assertTypeAlias = assertTypeAlias;
exports.assertTypeAnnotation = assertTypeAnnotation;
exports.assertTypeCastExpression = assertTypeCastExpression;
exports.assertTypeParameter = assertTypeParameter;
exports.assertTypeParameterDeclaration = assertTypeParameterDeclaration;
exports.assertTypeParameterInstantiation = assertTypeParameterInstantiation;
exports.assertTypeScript = assertTypeScript;
exports.assertTypeofTypeAnnotation = assertTypeofTypeAnnotation;
exports.assertUnaryExpression = assertUnaryExpression;
exports.assertUnaryLike = assertUnaryLike;
exports.assertUnionTypeAnnotation = assertUnionTypeAnnotation;
exports.assertUpdateExpression = assertUpdateExpression;
exports.assertUserWhitespacable = assertUserWhitespacable;
exports.assertV8IntrinsicIdentifier = assertV8IntrinsicIdentifier;
exports.assertVariableDeclaration = assertVariableDeclaration;
exports.assertVariableDeclarator = assertVariableDeclarator;
exports.assertVariance = assertVariance;
exports.assertVoidTypeAnnotation = assertVoidTypeAnnotation;
exports.assertWhile = assertWhile;
exports.assertWhileStatement = assertWhileStatement;
exports.assertWithStatement = assertWithStatement;
exports.assertYieldExpression = assertYieldExpression;


function assert(type, node, opts) {
  if (!(0, is_1.default)(type, node, opts)) {
    throw new Error(`Expected type "${type}" with option ${JSON.stringify(opts)}, ` + `but instead got "${node.type}".`);
  }
}
function assertArrayExpression(node, opts) {
  assert("ArrayExpression", node, opts);
}
function assertAssignmentExpression(node, opts) {
  assert("AssignmentExpression", node, opts);
}
function assertBinaryExpression(node, opts) {
  assert("BinaryExpression", node, opts);
}
function assertInterpreterDirective(node, opts) {
  assert("InterpreterDirective", node, opts);
}
function assertDirective(node, opts) {
  assert("Directive", node, opts);
}
function assertDirectiveLiteral(node, opts) {
  assert("DirectiveLiteral", node, opts);
}
function assertBlockStatement(node, opts) {
  assert("BlockStatement", node, opts);
}
function assertBreakStatement(node, opts) {
  assert("BreakStatement", node, opts);
}
function assertCallExpression(node, opts) {
  assert("CallExpression", node, opts);
}
function assertCatchClause(node, opts) {
  assert("CatchClause", node, opts);
}
function assertConditionalExpression(node, opts) {
  assert("ConditionalExpression", node, opts);
}
function assertContinueStatement(node, opts) {
  assert("ContinueStatement", node, opts);
}
function assertDebuggerStatement(node, opts) {
  assert("DebuggerStatement", node, opts);
}
function assertDoWhileStatement(node, opts) {
  assert("DoWhileStatement", node, opts);
}
function assertEmptyStatement(node, opts) {
  assert("EmptyStatement", node, opts);
}
function assertExpressionStatement(node, opts) {
  assert("ExpressionStatement", node, opts);
}
function assertFile(node, opts) {
  assert("File", node, opts);
}
function assertForInStatement(node, opts) {
  assert("ForInStatement", node, opts);
}
function assertForStatement(node, opts) {
  assert("ForStatement", node, opts);
}
function assertFunctionDeclaration(node, opts) {
  assert("FunctionDeclaration", node, opts);
}
function assertFunctionExpression(node, opts) {
  assert("FunctionExpression", node, opts);
}
function assertIdentifier(node, opts) {
  assert("Identifier", node, opts);
}
function assertIfStatement(node, opts) {
  assert("IfStatement", node, opts);
}
function assertLabeledStatement(node, opts) {
  assert("LabeledStatement", node, opts);
}
function assertStringLiteral(node, opts) {
  assert("StringLiteral", node, opts);
}
function assertNumericLiteral(node, opts) {
  assert("NumericLiteral", node, opts);
}
function assertNullLiteral(node, opts) {
  assert("NullLiteral", node, opts);
}
function assertBooleanLiteral(node, opts) {
  assert("BooleanLiteral", node, opts);
}
function assertRegExpLiteral(node, opts) {
  assert("RegExpLiteral", node, opts);
}
function assertLogicalExpression(node, opts) {
  assert("LogicalExpression", node, opts);
}
function assertMemberExpression(node, opts) {
  assert("MemberExpression", node, opts);
}
function assertNewExpression(node, opts) {
  assert("NewExpression", node, opts);
}
function assertProgram(node, opts) {
  assert("Program", node, opts);
}
function assertObjectExpression(node, opts) {
  assert("ObjectExpression", node, opts);
}
function assertObjectMethod(node, opts) {
  assert("ObjectMethod", node, opts);
}
function assertObjectProperty(node, opts) {
  assert("ObjectProperty", node, opts);
}
function assertRestElement(node, opts) {
  assert("RestElement", node, opts);
}
function assertReturnStatement(node, opts) {
  assert("ReturnStatement", node, opts);
}
function assertSequenceExpression(node, opts) {
  assert("SequenceExpression", node, opts);
}
function assertParenthesizedExpression(node, opts) {
  assert("ParenthesizedExpression", node, opts);
}
function assertSwitchCase(node, opts) {
  assert("SwitchCase", node, opts);
}
function assertSwitchStatement(node, opts) {
  assert("SwitchStatement", node, opts);
}
function assertThisExpression(node, opts) {
  assert("ThisExpression", node, opts);
}
function assertThrowStatement(node, opts) {
  assert("ThrowStatement", node, opts);
}
function assertTryStatement(node, opts) {
  assert("TryStatement", node, opts);
}
function assertUnaryExpression(node, opts) {
  assert("UnaryExpression", node, opts);
}
function assertUpdateExpression(node, opts) {
  assert("UpdateExpression", node, opts);
}
function assertVariableDeclaration(node, opts) {
  assert("VariableDeclaration", node, opts);
}
function assertVariableDeclarator(node, opts) {
  assert("VariableDeclarator", node, opts);
}
function assertWhileStatement(node, opts) {
  assert("WhileStatement", node, opts);
}
function assertWithStatement(node, opts) {
  assert("WithStatement", node, opts);
}
function assertAssignmentPattern(node, opts) {
  assert("AssignmentPattern", node, opts);
}
function assertArrayPattern(node, opts) {
  assert("ArrayPattern", node, opts);
}
function assertArrowFunctionExpression(node, opts) {
  assert("ArrowFunctionExpression", node, opts);
}
function assertClassBody(node, opts) {
  assert("ClassBody", node, opts);
}
function assertClassExpression(node, opts) {
  assert("ClassExpression", node, opts);
}
function assertClassDeclaration(node, opts) {
  assert("ClassDeclaration", node, opts);
}
function assertExportAllDeclaration(node, opts) {
  assert("ExportAllDeclaration", node, opts);
}
function assertExportDefaultDeclaration(node, opts) {
  assert("ExportDefaultDeclaration", node, opts);
}
function assertExportNamedDeclaration(node, opts) {
  assert("ExportNamedDeclaration", node, opts);
}
function assertExportSpecifier(node, opts) {
  assert("ExportSpecifier", node, opts);
}
function assertForOfStatement(node, opts) {
  assert("ForOfStatement", node, opts);
}
function assertImportDeclaration(node, opts) {
  assert("ImportDeclaration", node, opts);
}
function assertImportDefaultSpecifier(node, opts) {
  assert("ImportDefaultSpecifier", node, opts);
}
function assertImportNamespaceSpecifier(node, opts) {
  assert("ImportNamespaceSpecifier", node, opts);
}
function assertImportSpecifier(node, opts) {
  assert("ImportSpecifier", node, opts);
}
function assertImportExpression(node, opts) {
  assert("ImportExpression", node, opts);
}
function assertMetaProperty(node, opts) {
  assert("MetaProperty", node, opts);
}
function assertClassMethod(node, opts) {
  assert("ClassMethod", node, opts);
}
function assertObjectPattern(node, opts) {
  assert("ObjectPattern", node, opts);
}
function assertSpreadElement(node, opts) {
  assert("SpreadElement", node, opts);
}
function assertSuper(node, opts) {
  assert("Super", node, opts);
}
function assertTaggedTemplateExpression(node, opts) {
  assert("TaggedTemplateExpression", node, opts);
}
function assertTemplateElement(node, opts) {
  assert("TemplateElement", node, opts);
}
function assertTemplateLiteral(node, opts) {
  assert("TemplateLiteral", node, opts);
}
function assertYieldExpression(node, opts) {
  assert("YieldExpression", node, opts);
}
function assertAwaitExpression(node, opts) {
  assert("AwaitExpression", node, opts);
}
function assertImport(node, opts) {
  assert("Import", node, opts);
}
function assertBigIntLiteral(node, opts) {
  assert("BigIntLiteral", node, opts);
}
function assertExportNamespaceSpecifier(node, opts) {
  assert("ExportNamespaceSpecifier", node, opts);
}
function assertOptionalMemberExpression(node, opts) {
  assert("OptionalMemberExpression", node, opts);
}
function assertOptionalCallExpression(node, opts) {
  assert("OptionalCallExpression", node, opts);
}
function assertClassProperty(node, opts) {
  assert("ClassProperty", node, opts);
}
function assertClassAccessorProperty(node, opts) {
  assert("ClassAccessorProperty", node, opts);
}
function assertClassPrivateProperty(node, opts) {
  assert("ClassPrivateProperty", node, opts);
}
function assertClassPrivateMethod(node, opts) {
  assert("ClassPrivateMethod", node, opts);
}
function assertPrivateName(node, opts) {
  assert("PrivateName", node, opts);
}
function assertStaticBlock(node, opts) {
  assert("StaticBlock", node, opts);
}
function assertAnyTypeAnnotation(node, opts) {
  assert("AnyTypeAnnotation", node, opts);
}
function assertArrayTypeAnnotation(node, opts) {
  assert("ArrayTypeAnnotation", node, opts);
}
function assertBooleanTypeAnnotation(node, opts) {
  assert("BooleanTypeAnnotation", node, opts);
}
function assertBooleanLiteralTypeAnnotation(node, opts) {
  assert("BooleanLiteralTypeAnnotation", node, opts);
}
function assertNullLiteralTypeAnnotation(node, opts) {
  assert("NullLiteralTypeAnnotation", node, opts);
}
function assertClassImplements(node, opts) {
  assert("ClassImplements", node, opts);
}
function assertDeclareClass(node, opts) {
  assert("DeclareClass", node, opts);
}
function assertDeclareFunction(node, opts) {
  assert("DeclareFunction", node, opts);
}
function assertDeclareInterface(node, opts) {
  assert("DeclareInterface", node, opts);
}
function assertDeclareModule(node, opts) {
  assert("DeclareModule", node, opts);
}
function assertDeclareModuleExports(node, opts) {
  assert("DeclareModuleExports", node, opts);
}
function assertDeclareTypeAlias(node, opts) {
  assert("DeclareTypeAlias", node, opts);
}
function assertDeclareOpaqueType(node, opts) {
  assert("DeclareOpaqueType", node, opts);
}
function assertDeclareVariable(node, opts) {
  assert("DeclareVariable", node, opts);
}
function assertDeclareExportDeclaration(node, opts) {
  assert("DeclareExportDeclaration", node, opts);
}
function assertDeclareExportAllDeclaration(node, opts) {
  assert("DeclareExportAllDeclaration", node, opts);
}
function assertDeclaredPredicate(node, opts) {
  assert("DeclaredPredicate", node, opts);
}
function assertExistsTypeAnnotation(node, opts) {
  assert("ExistsTypeAnnotation", node, opts);
}
function assertFunctionTypeAnnotation(node, opts) {
  assert("FunctionTypeAnnotation", node, opts);
}
function assertFunctionTypeParam(node, opts) {
  assert("FunctionTypeParam", node, opts);
}
function assertGenericTypeAnnotation(node, opts) {
  assert("GenericTypeAnnotation", node, opts);
}
function assertInferredPredicate(node, opts) {
  assert("InferredPredicate", node, opts);
}
function assertInterfaceExtends(node, opts) {
  assert("InterfaceExtends", node, opts);
}
function assertInterfaceDeclaration(node, opts) {
  assert("InterfaceDeclaration", node, opts);
}
function assertInterfaceTypeAnnotation(node, opts) {
  assert("InterfaceTypeAnnotation", node, opts);
}
function assertIntersectionTypeAnnotation(node, opts) {
  assert("IntersectionTypeAnnotation", node, opts);
}
function assertMixedTypeAnnotation(node, opts) {
  assert("MixedTypeAnnotation", node, opts);
}
function assertEmptyTypeAnnotation(node, opts) {
  assert("EmptyTypeAnnotation", node, opts);
}
function assertNullableTypeAnnotation(node, opts) {
  assert("NullableTypeAnnotation", node, opts);
}
function assertNumberLiteralTypeAnnotation(node, opts) {
  assert("NumberLiteralTypeAnnotation", node, opts);
}
function assertNumberTypeAnnotation(node, opts) {
  assert("NumberTypeAnnotation", node, opts);
}
function assertObjectTypeAnnotation(node, opts) {
  assert("ObjectTypeAnnotation", node, opts);
}
function assertObjectTypeInternalSlot(node, opts) {
  assert("ObjectTypeInternalSlot", node, opts);
}
function assertObjectTypeCallProperty(node, opts) {
  assert("ObjectTypeCallProperty", node, opts);
}
function assertObjectTypeIndexer(node, opts) {
  assert("ObjectTypeIndexer", node, opts);
}
function assertObjectTypeProperty(node, opts) {
  assert("ObjectTypeProperty", node, opts);
}
function assertObjectTypeSpreadProperty(node, opts) {
  assert("ObjectTypeSpreadProperty", node, opts);
}
function assertOpaqueType(node, opts) {
  assert("OpaqueType", node, opts);
}
function assertQualifiedTypeIdentifier(node, opts) {
  assert("QualifiedTypeIdentifier", node, opts);
}
function assertStringLiteralTypeAnnotation(node, opts) {
  assert("StringLiteralTypeAnnotation", node, opts);
}
function assertStringTypeAnnotation(node, opts) {
  assert("StringTypeAnnotation", node, opts);
}
function assertSymbolTypeAnnotation(node, opts) {
  assert("SymbolTypeAnnotation", node, opts);
}
function assertThisTypeAnnotation(node, opts) {
  assert("ThisTypeAnnotation", node, opts);
}
function assertTupleTypeAnnotation(node, opts) {
  assert("TupleTypeAnnotation", node, opts);
}
function assertTypeofTypeAnnotation(node, opts) {
  assert("TypeofTypeAnnotation", node, opts);
}
function assertTypeAlias(node, opts) {
  assert("TypeAlias", node, opts);
}
function assertTypeAnnotation(node, opts) {
  assert("TypeAnnotation", node, opts);
}
function assertTypeCastExpression(node, opts) {
  assert("TypeCastExpression", node, opts);
}
function assertTypeParameter(node, opts) {
  assert("TypeParameter", node, opts);
}
function assertTypeParameterDeclaration(node, opts) {
  assert("TypeParameterDeclaration", node, opts);
}
function assertTypeParameterInstantiation(node, opts) {
  assert("TypeParameterInstantiation", node, opts);
}
function assertUnionTypeAnnotation(node, opts) {
  assert("UnionTypeAnnotation", node, opts);
}
function assertVariance(node, opts) {
  assert("Variance", node, opts);
}
function assertVoidTypeAnnotation(node, opts) {
  assert("VoidTypeAnnotation", node, opts);
}
function assertEnumDeclaration(node, opts) {
  assert("EnumDeclaration", node, opts);
}
function assertEnumBooleanBody(node, opts) {
  assert("EnumBooleanBody", node, opts);
}
function assertEnumNumberBody(node, opts) {
  assert("EnumNumberBody", node, opts);
}
function assertEnumStringBody(node, opts) {
  assert("EnumStringBody", node, opts);
}
function assertEnumSymbolBody(node, opts) {
  assert("EnumSymbolBody", node, opts);
}
function assertEnumBooleanMember(node, opts) {
  assert("EnumBooleanMember", node, opts);
}
function assertEnumNumberMember(node, opts) {
  assert("EnumNumberMember", node, opts);
}
function assertEnumStringMember(node, opts) {
  assert("EnumStringMember", node, opts);
}
function assertEnumDefaultedMember(node, opts) {
  assert("EnumDefaultedMember", node, opts);
}
function assertIndexedAccessType(node, opts) {
  assert("IndexedAccessType", node, opts);
}
function assertOptionalIndexedAccessType(node, opts) {
  assert("OptionalIndexedAccessType", node, opts);
}
function assertJSXAttribute(node, opts) {
  assert("JSXAttribute", node, opts);
}
function assertJSXClosingElement(node, opts) {
  assert("JSXClosingElement", node, opts);
}
function assertJSXElement(node, opts) {
  assert("JSXElement", node, opts);
}
function assertJSXEmptyExpression(node, opts) {
  assert("JSXEmptyExpression", node, opts);
}
function assertJSXExpressionContainer(node, opts) {
  assert("JSXExpressionContainer", node, opts);
}
function assertJSXSpreadChild(node, opts) {
  assert("JSXSpreadChild", node, opts);
}
function assertJSXIdentifier(node, opts) {
  assert("JSXIdentifier", node, opts);
}
function assertJSXMemberExpression(node, opts) {
  assert("JSXMemberExpression", node, opts);
}
function assertJSXNamespacedName(node, opts) {
  assert("JSXNamespacedName", node, opts);
}
function assertJSXOpeningElement(node, opts) {
  assert("JSXOpeningElement", node, opts);
}
function assertJSXSpreadAttribute(node, opts) {
  assert("JSXSpreadAttribute", node, opts);
}
function assertJSXText(node, opts) {
  assert("JSXText", node, opts);
}
function assertJSXFragment(node, opts) {
  assert("JSXFragment", node, opts);
}
function assertJSXOpeningFragment(node, opts) {
  assert("JSXOpeningFragment", node, opts);
}
function assertJSXClosingFragment(node, opts) {
  assert("JSXClosingFragment", node, opts);
}
function assertNoop(node, opts) {
  assert("Noop", node, opts);
}
function assertPlaceholder(node, opts) {
  assert("Placeholder", node, opts);
}
function assertV8IntrinsicIdentifier(node, opts) {
  assert("V8IntrinsicIdentifier", node, opts);
}
function assertArgumentPlaceholder(node, opts) {
  assert("ArgumentPlaceholder", node, opts);
}
function assertBindExpression(node, opts) {
  assert("BindExpression", node, opts);
}
function assertImportAttribute(node, opts) {
  assert("ImportAttribute", node, opts);
}
function assertDecorator(node, opts) {
  assert("Decorator", node, opts);
}
function assertDoExpression(node, opts) {
  assert("DoExpression", node, opts);
}
function assertExportDefaultSpecifier(node, opts) {
  assert("ExportDefaultSpecifier", node, opts);
}
function assertRecordExpression(node, opts) {
  assert("RecordExpression", node, opts);
}
function assertTupleExpression(node, opts) {
  assert("TupleExpression", node, opts);
}
function assertDecimalLiteral(node, opts) {
  assert("DecimalLiteral", node, opts);
}
function assertModuleExpression(node, opts) {
  assert("ModuleExpression", node, opts);
}
function assertTopicReference(node, opts) {
  assert("TopicReference", node, opts);
}
function assertPipelineTopicExpression(node, opts) {
  assert("PipelineTopicExpression", node, opts);
}
function assertPipelineBareFunction(node, opts) {
  assert("PipelineBareFunction", node, opts);
}
function assertPipelinePrimaryTopicReference(node, opts) {
  assert("PipelinePrimaryTopicReference", node, opts);
}
function assertTSParameterProperty(node, opts) {
  assert("TSParameterProperty", node, opts);
}
function assertTSDeclareFunction(node, opts) {
  assert("TSDeclareFunction", node, opts);
}
function assertTSDeclareMethod(node, opts) {
  assert("TSDeclareMethod", node, opts);
}
function assertTSQualifiedName(node, opts) {
  assert("TSQualifiedName", node, opts);
}
function assertTSCallSignatureDeclaration(node, opts) {
  assert("TSCallSignatureDeclaration", node, opts);
}
function assertTSConstructSignatureDeclaration(node, opts) {
  assert("TSConstructSignatureDeclaration", node, opts);
}
function assertTSPropertySignature(node, opts) {
  assert("TSPropertySignature", node, opts);
}
function assertTSMethodSignature(node, opts) {
  assert("TSMethodSignature", node, opts);
}
function assertTSIndexSignature(node, opts) {
  assert("TSIndexSignature", node, opts);
}
function assertTSAnyKeyword(node, opts) {
  assert("TSAnyKeyword", node, opts);
}
function assertTSBooleanKeyword(node, opts) {
  assert("TSBooleanKeyword", node, opts);
}
function assertTSBigIntKeyword(node, opts) {
  assert("TSBigIntKeyword", node, opts);
}
function assertTSIntrinsicKeyword(node, opts) {
  assert("TSIntrinsicKeyword", node, opts);
}
function assertTSNeverKeyword(node, opts) {
  assert("TSNeverKeyword", node, opts);
}
function assertTSNullKeyword(node, opts) {
  assert("TSNullKeyword", node, opts);
}
function assertTSNumberKeyword(node, opts) {
  assert("TSNumberKeyword", node, opts);
}
function assertTSObjectKeyword(node, opts) {
  assert("TSObjectKeyword", node, opts);
}
function assertTSStringKeyword(node, opts) {
  assert("TSStringKeyword", node, opts);
}
function assertTSSymbolKeyword(node, opts) {
  assert("TSSymbolKeyword", node, opts);
}
function assertTSUndefinedKeyword(node, opts) {
  assert("TSUndefinedKeyword", node, opts);
}
function assertTSUnknownKeyword(node, opts) {
  assert("TSUnknownKeyword", node, opts);
}
function assertTSVoidKeyword(node, opts) {
  assert("TSVoidKeyword", node, opts);
}
function assertTSThisType(node, opts) {
  assert("TSThisType", node, opts);
}
function assertTSFunctionType(node, opts) {
  assert("TSFunctionType", node, opts);
}
function assertTSConstructorType(node, opts) {
  assert("TSConstructorType", node, opts);
}
function assertTSTypeReference(node, opts) {
  assert("TSTypeReference", node, opts);
}
function assertTSTypePredicate(node, opts) {
  assert("TSTypePredicate", node, opts);
}
function assertTSTypeQuery(node, opts) {
  assert("TSTypeQuery", node, opts);
}
function assertTSTypeLiteral(node, opts) {
  assert("TSTypeLiteral", node, opts);
}
function assertTSArrayType(node, opts) {
  assert("TSArrayType", node, opts);
}
function assertTSTupleType(node, opts) {
  assert("TSTupleType", node, opts);
}
function assertTSOptionalType(node, opts) {
  assert("TSOptionalType", node, opts);
}
function assertTSRestType(node, opts) {
  assert("TSRestType", node, opts);
}
function assertTSNamedTupleMember(node, opts) {
  assert("TSNamedTupleMember", node, opts);
}
function assertTSUnionType(node, opts) {
  assert("TSUnionType", node, opts);
}
function assertTSIntersectionType(node, opts) {
  assert("TSIntersectionType", node, opts);
}
function assertTSConditionalType(node, opts) {
  assert("TSConditionalType", node, opts);
}
function assertTSInferType(node, opts) {
  assert("TSInferType", node, opts);
}
function assertTSParenthesizedType(node, opts) {
  assert("TSParenthesizedType", node, opts);
}
function assertTSTypeOperator(node, opts) {
  assert("TSTypeOperator", node, opts);
}
function assertTSIndexedAccessType(node, opts) {
  assert("TSIndexedAccessType", node, opts);
}
function assertTSMappedType(node, opts) {
  assert("TSMappedType", node, opts);
}
function assertTSLiteralType(node, opts) {
  assert("TSLiteralType", node, opts);
}
function assertTSExpressionWithTypeArguments(node, opts) {
  assert("TSExpressionWithTypeArguments", node, opts);
}
function assertTSInterfaceDeclaration(node, opts) {
  assert("TSInterfaceDeclaration", node, opts);
}
function assertTSInterfaceBody(node, opts) {
  assert("TSInterfaceBody", node, opts);
}
function assertTSTypeAliasDeclaration(node, opts) {
  assert("TSTypeAliasDeclaration", node, opts);
}
function assertTSInstantiationExpression(node, opts) {
  assert("TSInstantiationExpression", node, opts);
}
function assertTSAsExpression(node, opts) {
  assert("TSAsExpression", node, opts);
}
function assertTSSatisfiesExpression(node, opts) {
  assert("TSSatisfiesExpression", node, opts);
}
function assertTSTypeAssertion(node, opts) {
  assert("TSTypeAssertion", node, opts);
}
function assertTSEnumDeclaration(node, opts) {
  assert("TSEnumDeclaration", node, opts);
}
function assertTSEnumMember(node, opts) {
  assert("TSEnumMember", node, opts);
}
function assertTSModuleDeclaration(node, opts) {
  assert("TSModuleDeclaration", node, opts);
}
function assertTSModuleBlock(node, opts) {
  assert("TSModuleBlock", node, opts);
}
function assertTSImportType(node, opts) {
  assert("TSImportType", node, opts);
}
function assertTSImportEqualsDeclaration(node, opts) {
  assert("TSImportEqualsDeclaration", node, opts);
}
function assertTSExternalModuleReference(node, opts) {
  assert("TSExternalModuleReference", node, opts);
}
function assertTSNonNullExpression(node, opts) {
  assert("TSNonNullExpression", node, opts);
}
function assertTSExportAssignment(node, opts) {
  assert("TSExportAssignment", node, opts);
}
function assertTSNamespaceExportDeclaration(node, opts) {
  assert("TSNamespaceExportDeclaration", node, opts);
}
function assertTSTypeAnnotation(node, opts) {
  assert("TSTypeAnnotation", node, opts);
}
function assertTSTypeParameterInstantiation(node, opts) {
  assert("TSTypeParameterInstantiation", node, opts);
}
function assertTSTypeParameterDeclaration(node, opts) {
  assert("TSTypeParameterDeclaration", node, opts);
}
function assertTSTypeParameter(node, opts) {
  assert("TSTypeParameter", node, opts);
}
function assertStandardized(node, opts) {
  assert("Standardized", node, opts);
}
function assertExpression(node, opts) {
  assert("Expression", node, opts);
}
function assertBinary(node, opts) {
  assert("Binary", node, opts);
}
function assertScopable(node, opts) {
  assert("Scopable", node, opts);
}
function assertBlockParent(node, opts) {
  assert("BlockParent", node, opts);
}
function assertBlock(node, opts) {
  assert("Block", node, opts);
}
function assertStatement(node, opts) {
  assert("Statement", node, opts);
}
function assertTerminatorless(node, opts) {
  assert("Terminatorless", node, opts);
}
function assertCompletionStatement(node, opts) {
  assert("CompletionStatement", node, opts);
}
function assertConditional(node, opts) {
  assert("Conditional", node, opts);
}
function assertLoop(node, opts) {
  assert("Loop", node, opts);
}
function assertWhile(node, opts) {
  assert("While", node, opts);
}
function assertExpressionWrapper(node, opts) {
  assert("ExpressionWrapper", node, opts);
}
function assertFor(node, opts) {
  assert("For", node, opts);
}
function assertForXStatement(node, opts) {
  assert("ForXStatement", node, opts);
}
function assertFunction(node, opts) {
  assert("Function", node, opts);
}
function assertFunctionParent(node, opts) {
  assert("FunctionParent", node, opts);
}
function assertPureish(node, opts) {
  assert("Pureish", node, opts);
}
function assertDeclaration(node, opts) {
  assert("Declaration", node, opts);
}
function assertPatternLike(node, opts) {
  assert("PatternLike", node, opts);
}
function assertLVal(node, opts) {
  assert("LVal", node, opts);
}
function assertTSEntityName(node, opts) {
  assert("TSEntityName", node, opts);
}
function assertLiteral(node, opts) {
  assert("Literal", node, opts);
}
function assertImmutable(node, opts) {
  assert("Immutable", node, opts);
}
function assertUserWhitespacable(node, opts) {
  assert("UserWhitespacable", node, opts);
}
function assertMethod(node, opts) {
  assert("Method", node, opts);
}
function assertObjectMember(node, opts) {
  assert("ObjectMember", node, opts);
}
function assertProperty(node, opts) {
  assert("Property", node, opts);
}
function assertUnaryLike(node, opts) {
  assert("UnaryLike", node, opts);
}
function assertPattern(node, opts) {
  assert("Pattern", node, opts);
}
function assertClass(node, opts) {
  assert("Class", node, opts);
}
function assertImportOrExportDeclaration(node, opts) {
  assert("ImportOrExportDeclaration", node, opts);
}
function assertExportDeclaration(node, opts) {
  assert("ExportDeclaration", node, opts);
}
function assertModuleSpecifier(node, opts) {
  assert("ModuleSpecifier", node, opts);
}
function assertAccessor(node, opts) {
  assert("Accessor", node, opts);
}
function assertPrivate(node, opts) {
  assert("Private", node, opts);
}
function assertFlow(node, opts) {
  assert("Flow", node, opts);
}
function assertFlowType(node, opts) {
  assert("FlowType", node, opts);
}
function assertFlowBaseAnnotation(node, opts) {
  assert("FlowBaseAnnotation", node, opts);
}
function assertFlowDeclaration(node, opts) {
  assert("FlowDeclaration", node, opts);
}
function assertFlowPredicate(node, opts) {
  assert("FlowPredicate", node, opts);
}
function assertEnumBody(node, opts) {
  assert("EnumBody", node, opts);
}
function assertEnumMember(node, opts) {
  assert("EnumMember", node, opts);
}
function assertJSX(node, opts) {
  assert("JSX", node, opts);
}
function assertMiscellaneous(node, opts) {
  assert("Miscellaneous", node, opts);
}
function assertTypeScript(node, opts) {
  assert("TypeScript", node, opts);
}
function assertTSTypeElement(node, opts) {
  assert("TSTypeElement", node, opts);
}
function assertTSType(node, opts) {
  assert("TSType", node, opts);
}
function assertTSBaseType(node, opts) {
  assert("TSBaseType", node, opts);
}
function assertNumberLiteral(node, opts) {
  (0, deprecationWarning_1.default)("assertNumberLiteral", "assertNumericLiteral");
  assert("NumberLiteral", node, opts);
}
function assertRegexLiteral(node, opts) {
  (0, deprecationWarning_1.default)("assertRegexLiteral", "assertRegExpLiteral");
  assert("RegexLiteral", node, opts);
}
function assertRestProperty(node, opts) {
  (0, deprecationWarning_1.default)("assertRestProperty", "assertRestElement");
  assert("RestProperty", node, opts);
}
function assertSpreadProperty(node, opts) {
  (0, deprecationWarning_1.default)("assertSpreadProperty", "assertSpreadElement");
  assert("SpreadProperty", node, opts);
}
function assertModuleDeclaration(node, opts) {
  (0, deprecationWarning_1.default)("assertModuleDeclaration", "assertImportOrExportDeclaration");
  assert("ModuleDeclaration", node, opts);
}


});

unwrapExports(generated$1);
generated$1.assertAccessor;
generated$1.assertAnyTypeAnnotation;
generated$1.assertArgumentPlaceholder;
generated$1.assertArrayExpression;
generated$1.assertArrayPattern;
generated$1.assertArrayTypeAnnotation;
generated$1.assertArrowFunctionExpression;
generated$1.assertAssignmentExpression;
generated$1.assertAssignmentPattern;
generated$1.assertAwaitExpression;
generated$1.assertBigIntLiteral;
generated$1.assertBinary;
generated$1.assertBinaryExpression;
generated$1.assertBindExpression;
generated$1.assertBlock;
generated$1.assertBlockParent;
generated$1.assertBlockStatement;
generated$1.assertBooleanLiteral;
generated$1.assertBooleanLiteralTypeAnnotation;
generated$1.assertBooleanTypeAnnotation;
generated$1.assertBreakStatement;
generated$1.assertCallExpression;
generated$1.assertCatchClause;
generated$1.assertClass;
generated$1.assertClassAccessorProperty;
generated$1.assertClassBody;
generated$1.assertClassDeclaration;
generated$1.assertClassExpression;
generated$1.assertClassImplements;
generated$1.assertClassMethod;
generated$1.assertClassPrivateMethod;
generated$1.assertClassPrivateProperty;
generated$1.assertClassProperty;
generated$1.assertCompletionStatement;
generated$1.assertConditional;
generated$1.assertConditionalExpression;
generated$1.assertContinueStatement;
generated$1.assertDebuggerStatement;
generated$1.assertDecimalLiteral;
generated$1.assertDeclaration;
generated$1.assertDeclareClass;
generated$1.assertDeclareExportAllDeclaration;
generated$1.assertDeclareExportDeclaration;
generated$1.assertDeclareFunction;
generated$1.assertDeclareInterface;
generated$1.assertDeclareModule;
generated$1.assertDeclareModuleExports;
generated$1.assertDeclareOpaqueType;
generated$1.assertDeclareTypeAlias;
generated$1.assertDeclareVariable;
generated$1.assertDeclaredPredicate;
generated$1.assertDecorator;
generated$1.assertDirective;
generated$1.assertDirectiveLiteral;
generated$1.assertDoExpression;
generated$1.assertDoWhileStatement;
generated$1.assertEmptyStatement;
generated$1.assertEmptyTypeAnnotation;
generated$1.assertEnumBody;
generated$1.assertEnumBooleanBody;
generated$1.assertEnumBooleanMember;
generated$1.assertEnumDeclaration;
generated$1.assertEnumDefaultedMember;
generated$1.assertEnumMember;
generated$1.assertEnumNumberBody;
generated$1.assertEnumNumberMember;
generated$1.assertEnumStringBody;
generated$1.assertEnumStringMember;
generated$1.assertEnumSymbolBody;
generated$1.assertExistsTypeAnnotation;
generated$1.assertExportAllDeclaration;
generated$1.assertExportDeclaration;
generated$1.assertExportDefaultDeclaration;
generated$1.assertExportDefaultSpecifier;
generated$1.assertExportNamedDeclaration;
generated$1.assertExportNamespaceSpecifier;
generated$1.assertExportSpecifier;
generated$1.assertExpression;
generated$1.assertExpressionStatement;
generated$1.assertExpressionWrapper;
generated$1.assertFile;
generated$1.assertFlow;
generated$1.assertFlowBaseAnnotation;
generated$1.assertFlowDeclaration;
generated$1.assertFlowPredicate;
generated$1.assertFlowType;
generated$1.assertFor;
generated$1.assertForInStatement;
generated$1.assertForOfStatement;
generated$1.assertForStatement;
generated$1.assertForXStatement;
generated$1.assertFunction;
generated$1.assertFunctionDeclaration;
generated$1.assertFunctionExpression;
generated$1.assertFunctionParent;
generated$1.assertFunctionTypeAnnotation;
generated$1.assertFunctionTypeParam;
generated$1.assertGenericTypeAnnotation;
generated$1.assertIdentifier;
generated$1.assertIfStatement;
generated$1.assertImmutable;
generated$1.assertImport;
generated$1.assertImportAttribute;
generated$1.assertImportDeclaration;
generated$1.assertImportDefaultSpecifier;
generated$1.assertImportExpression;
generated$1.assertImportNamespaceSpecifier;
generated$1.assertImportOrExportDeclaration;
generated$1.assertImportSpecifier;
generated$1.assertIndexedAccessType;
generated$1.assertInferredPredicate;
generated$1.assertInterfaceDeclaration;
generated$1.assertInterfaceExtends;
generated$1.assertInterfaceTypeAnnotation;
generated$1.assertInterpreterDirective;
generated$1.assertIntersectionTypeAnnotation;
generated$1.assertJSX;
generated$1.assertJSXAttribute;
generated$1.assertJSXClosingElement;
generated$1.assertJSXClosingFragment;
generated$1.assertJSXElement;
generated$1.assertJSXEmptyExpression;
generated$1.assertJSXExpressionContainer;
generated$1.assertJSXFragment;
generated$1.assertJSXIdentifier;
generated$1.assertJSXMemberExpression;
generated$1.assertJSXNamespacedName;
generated$1.assertJSXOpeningElement;
generated$1.assertJSXOpeningFragment;
generated$1.assertJSXSpreadAttribute;
generated$1.assertJSXSpreadChild;
generated$1.assertJSXText;
generated$1.assertLVal;
generated$1.assertLabeledStatement;
generated$1.assertLiteral;
generated$1.assertLogicalExpression;
generated$1.assertLoop;
generated$1.assertMemberExpression;
generated$1.assertMetaProperty;
generated$1.assertMethod;
generated$1.assertMiscellaneous;
generated$1.assertMixedTypeAnnotation;
generated$1.assertModuleDeclaration;
generated$1.assertModuleExpression;
generated$1.assertModuleSpecifier;
generated$1.assertNewExpression;
generated$1.assertNoop;
generated$1.assertNullLiteral;
generated$1.assertNullLiteralTypeAnnotation;
generated$1.assertNullableTypeAnnotation;
generated$1.assertNumberLiteral;
generated$1.assertNumberLiteralTypeAnnotation;
generated$1.assertNumberTypeAnnotation;
generated$1.assertNumericLiteral;
generated$1.assertObjectExpression;
generated$1.assertObjectMember;
generated$1.assertObjectMethod;
generated$1.assertObjectPattern;
generated$1.assertObjectProperty;
generated$1.assertObjectTypeAnnotation;
generated$1.assertObjectTypeCallProperty;
generated$1.assertObjectTypeIndexer;
generated$1.assertObjectTypeInternalSlot;
generated$1.assertObjectTypeProperty;
generated$1.assertObjectTypeSpreadProperty;
generated$1.assertOpaqueType;
generated$1.assertOptionalCallExpression;
generated$1.assertOptionalIndexedAccessType;
generated$1.assertOptionalMemberExpression;
generated$1.assertParenthesizedExpression;
generated$1.assertPattern;
generated$1.assertPatternLike;
generated$1.assertPipelineBareFunction;
generated$1.assertPipelinePrimaryTopicReference;
generated$1.assertPipelineTopicExpression;
generated$1.assertPlaceholder;
generated$1.assertPrivate;
generated$1.assertPrivateName;
generated$1.assertProgram;
generated$1.assertProperty;
generated$1.assertPureish;
generated$1.assertQualifiedTypeIdentifier;
generated$1.assertRecordExpression;
generated$1.assertRegExpLiteral;
generated$1.assertRegexLiteral;
generated$1.assertRestElement;
generated$1.assertRestProperty;
generated$1.assertReturnStatement;
generated$1.assertScopable;
generated$1.assertSequenceExpression;
generated$1.assertSpreadElement;
generated$1.assertSpreadProperty;
generated$1.assertStandardized;
generated$1.assertStatement;
generated$1.assertStaticBlock;
generated$1.assertStringLiteral;
generated$1.assertStringLiteralTypeAnnotation;
generated$1.assertStringTypeAnnotation;
generated$1.assertSuper;
generated$1.assertSwitchCase;
generated$1.assertSwitchStatement;
generated$1.assertSymbolTypeAnnotation;
generated$1.assertTSAnyKeyword;
generated$1.assertTSArrayType;
generated$1.assertTSAsExpression;
generated$1.assertTSBaseType;
generated$1.assertTSBigIntKeyword;
generated$1.assertTSBooleanKeyword;
generated$1.assertTSCallSignatureDeclaration;
generated$1.assertTSConditionalType;
generated$1.assertTSConstructSignatureDeclaration;
generated$1.assertTSConstructorType;
generated$1.assertTSDeclareFunction;
generated$1.assertTSDeclareMethod;
generated$1.assertTSEntityName;
generated$1.assertTSEnumDeclaration;
generated$1.assertTSEnumMember;
generated$1.assertTSExportAssignment;
generated$1.assertTSExpressionWithTypeArguments;
generated$1.assertTSExternalModuleReference;
generated$1.assertTSFunctionType;
generated$1.assertTSImportEqualsDeclaration;
generated$1.assertTSImportType;
generated$1.assertTSIndexSignature;
generated$1.assertTSIndexedAccessType;
generated$1.assertTSInferType;
generated$1.assertTSInstantiationExpression;
generated$1.assertTSInterfaceBody;
generated$1.assertTSInterfaceDeclaration;
generated$1.assertTSIntersectionType;
generated$1.assertTSIntrinsicKeyword;
generated$1.assertTSLiteralType;
generated$1.assertTSMappedType;
generated$1.assertTSMethodSignature;
generated$1.assertTSModuleBlock;
generated$1.assertTSModuleDeclaration;
generated$1.assertTSNamedTupleMember;
generated$1.assertTSNamespaceExportDeclaration;
generated$1.assertTSNeverKeyword;
generated$1.assertTSNonNullExpression;
generated$1.assertTSNullKeyword;
generated$1.assertTSNumberKeyword;
generated$1.assertTSObjectKeyword;
generated$1.assertTSOptionalType;
generated$1.assertTSParameterProperty;
generated$1.assertTSParenthesizedType;
generated$1.assertTSPropertySignature;
generated$1.assertTSQualifiedName;
generated$1.assertTSRestType;
generated$1.assertTSSatisfiesExpression;
generated$1.assertTSStringKeyword;
generated$1.assertTSSymbolKeyword;
generated$1.assertTSThisType;
generated$1.assertTSTupleType;
generated$1.assertTSType;
generated$1.assertTSTypeAliasDeclaration;
generated$1.assertTSTypeAnnotation;
generated$1.assertTSTypeAssertion;
generated$1.assertTSTypeElement;
generated$1.assertTSTypeLiteral;
generated$1.assertTSTypeOperator;
generated$1.assertTSTypeParameter;
generated$1.assertTSTypeParameterDeclaration;
generated$1.assertTSTypeParameterInstantiation;
generated$1.assertTSTypePredicate;
generated$1.assertTSTypeQuery;
generated$1.assertTSTypeReference;
generated$1.assertTSUndefinedKeyword;
generated$1.assertTSUnionType;
generated$1.assertTSUnknownKeyword;
generated$1.assertTSVoidKeyword;
generated$1.assertTaggedTemplateExpression;
generated$1.assertTemplateElement;
generated$1.assertTemplateLiteral;
generated$1.assertTerminatorless;
generated$1.assertThisExpression;
generated$1.assertThisTypeAnnotation;
generated$1.assertThrowStatement;
generated$1.assertTopicReference;
generated$1.assertTryStatement;
generated$1.assertTupleExpression;
generated$1.assertTupleTypeAnnotation;
generated$1.assertTypeAlias;
generated$1.assertTypeAnnotation;
generated$1.assertTypeCastExpression;
generated$1.assertTypeParameter;
generated$1.assertTypeParameterDeclaration;
generated$1.assertTypeParameterInstantiation;
generated$1.assertTypeScript;
generated$1.assertTypeofTypeAnnotation;
generated$1.assertUnaryExpression;
generated$1.assertUnaryLike;
generated$1.assertUnionTypeAnnotation;
generated$1.assertUpdateExpression;
generated$1.assertUserWhitespacable;
generated$1.assertV8IntrinsicIdentifier;
generated$1.assertVariableDeclaration;
generated$1.assertVariableDeclarator;
generated$1.assertVariance;
generated$1.assertVoidTypeAnnotation;
generated$1.assertWhile;
generated$1.assertWhileStatement;
generated$1.assertWithStatement;
generated$1.assertYieldExpression;

var createTypeAnnotationBasedOnTypeof_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

exports.default = createTypeAnnotationBasedOnTypeof;
function createTypeAnnotationBasedOnTypeof(type) {
  switch (type) {
    case "string":
      return (0, generated$2.stringTypeAnnotation)();
    case "number":
      return (0, generated$2.numberTypeAnnotation)();
    case "undefined":
      return (0, generated$2.voidTypeAnnotation)();
    case "boolean":
      return (0, generated$2.booleanTypeAnnotation)();
    case "function":
      return (0, generated$2.genericTypeAnnotation)((0, generated$2.identifier)("Function"));
    case "object":
      return (0, generated$2.genericTypeAnnotation)((0, generated$2.identifier)("Object"));
    case "symbol":
      return (0, generated$2.genericTypeAnnotation)((0, generated$2.identifier)("Symbol"));
    case "bigint":
      return (0, generated$2.anyTypeAnnotation)();
  }
  throw new Error("Invalid typeof value: " + type);
}


});

unwrapExports(createTypeAnnotationBasedOnTypeof_1);

var removeTypeDuplicates_1$1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeTypeDuplicates;

function getQualifiedName(node) {
  return (0, generated$3.isIdentifier)(node) ? node.name : `${node.id.name}.${getQualifiedName(node.qualification)}`;
}
function removeTypeDuplicates(nodesIn) {
  const nodes = Array.from(nodesIn);
  const generics = new Map();
  const bases = new Map();
  const typeGroups = new Set();
  const types = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node) continue;
    if (types.indexOf(node) >= 0) {
      continue;
    }
    if ((0, generated$3.isAnyTypeAnnotation)(node)) {
      return [node];
    }
    if ((0, generated$3.isFlowBaseAnnotation)(node)) {
      bases.set(node.type, node);
      continue;
    }
    if ((0, generated$3.isUnionTypeAnnotation)(node)) {
      if (!typeGroups.has(node.types)) {
        nodes.push(...node.types);
        typeGroups.add(node.types);
      }
      continue;
    }
    if ((0, generated$3.isGenericTypeAnnotation)(node)) {
      const name = getQualifiedName(node.id);
      if (generics.has(name)) {
        let existing = generics.get(name);
        if (existing.typeParameters) {
          if (node.typeParameters) {
            existing.typeParameters.params.push(...node.typeParameters.params);
            existing.typeParameters.params = removeTypeDuplicates(existing.typeParameters.params);
          }
        } else {
          existing = node.typeParameters;
        }
      } else {
        generics.set(name, node);
      }
      continue;
    }
    types.push(node);
  }
  for (const [, baseType] of bases) {
    types.push(baseType);
  }
  for (const [, genericName] of generics) {
    types.push(genericName);
  }
  return types;
}


});

unwrapExports(removeTypeDuplicates_1$1);

var createFlowUnionType_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createFlowUnionType;


function createFlowUnionType(types) {
  const flattened = (0, removeTypeDuplicates_1$1.default)(types);
  if (flattened.length === 1) {
    return flattened[0];
  } else {
    return (0, generated$2.unionTypeAnnotation)(flattened);
  }
}


});

unwrapExports(createFlowUnionType_1);

var removeTypeDuplicates_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeTypeDuplicates;

function getQualifiedName(node) {
  return (0, generated$3.isIdentifier)(node) ? node.name : `${node.right.name}.${getQualifiedName(node.left)}`;
}
function removeTypeDuplicates(nodesIn) {
  const nodes = Array.from(nodesIn);
  const generics = new Map();
  const bases = new Map();
  const typeGroups = new Set();
  const types = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node) continue;
    if (types.indexOf(node) >= 0) {
      continue;
    }
    if ((0, generated$3.isTSAnyKeyword)(node)) {
      return [node];
    }
    if ((0, generated$3.isTSBaseType)(node)) {
      bases.set(node.type, node);
      continue;
    }
    if ((0, generated$3.isTSUnionType)(node)) {
      if (!typeGroups.has(node.types)) {
        nodes.push(...node.types);
        typeGroups.add(node.types);
      }
      continue;
    }
    if ((0, generated$3.isTSTypeReference)(node) && node.typeParameters) {
      const name = getQualifiedName(node.typeName);
      if (generics.has(name)) {
        let existing = generics.get(name);
        if (existing.typeParameters) {
          if (node.typeParameters) {
            existing.typeParameters.params.push(...node.typeParameters.params);
            existing.typeParameters.params = removeTypeDuplicates(existing.typeParameters.params);
          }
        } else {
          existing = node.typeParameters;
        }
      } else {
        generics.set(name, node);
      }
      continue;
    }
    types.push(node);
  }
  for (const [, baseType] of bases) {
    types.push(baseType);
  }
  for (const [, genericName] of generics) {
    types.push(genericName);
  }
  return types;
}


});

unwrapExports(removeTypeDuplicates_1);

var createTSUnionType_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTSUnionType;



function createTSUnionType(typeAnnotations) {
  const types = typeAnnotations.map(type => {
    return (0, generated$3.isTSTypeAnnotation)(type) ? type.typeAnnotation : type;
  });
  const flattened = (0, removeTypeDuplicates_1.default)(types);
  if (flattened.length === 1) {
    return flattened[0];
  } else {
    return (0, generated$2.tsUnionType)(flattened);
  }
}


});

unwrapExports(createTSUnionType_1);

var uppercase = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AnyTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.anyTypeAnnotation;
  }
});
Object.defineProperty(exports, "ArgumentPlaceholder", {
  enumerable: true,
  get: function () {
    return generated$2.argumentPlaceholder;
  }
});
Object.defineProperty(exports, "ArrayExpression", {
  enumerable: true,
  get: function () {
    return generated$2.arrayExpression;
  }
});
Object.defineProperty(exports, "ArrayPattern", {
  enumerable: true,
  get: function () {
    return generated$2.arrayPattern;
  }
});
Object.defineProperty(exports, "ArrayTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.arrayTypeAnnotation;
  }
});
Object.defineProperty(exports, "ArrowFunctionExpression", {
  enumerable: true,
  get: function () {
    return generated$2.arrowFunctionExpression;
  }
});
Object.defineProperty(exports, "AssignmentExpression", {
  enumerable: true,
  get: function () {
    return generated$2.assignmentExpression;
  }
});
Object.defineProperty(exports, "AssignmentPattern", {
  enumerable: true,
  get: function () {
    return generated$2.assignmentPattern;
  }
});
Object.defineProperty(exports, "AwaitExpression", {
  enumerable: true,
  get: function () {
    return generated$2.awaitExpression;
  }
});
Object.defineProperty(exports, "BigIntLiteral", {
  enumerable: true,
  get: function () {
    return generated$2.bigIntLiteral;
  }
});
Object.defineProperty(exports, "BinaryExpression", {
  enumerable: true,
  get: function () {
    return generated$2.binaryExpression;
  }
});
Object.defineProperty(exports, "BindExpression", {
  enumerable: true,
  get: function () {
    return generated$2.bindExpression;
  }
});
Object.defineProperty(exports, "BlockStatement", {
  enumerable: true,
  get: function () {
    return generated$2.blockStatement;
  }
});
Object.defineProperty(exports, "BooleanLiteral", {
  enumerable: true,
  get: function () {
    return generated$2.booleanLiteral;
  }
});
Object.defineProperty(exports, "BooleanLiteralTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.booleanLiteralTypeAnnotation;
  }
});
Object.defineProperty(exports, "BooleanTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.booleanTypeAnnotation;
  }
});
Object.defineProperty(exports, "BreakStatement", {
  enumerable: true,
  get: function () {
    return generated$2.breakStatement;
  }
});
Object.defineProperty(exports, "CallExpression", {
  enumerable: true,
  get: function () {
    return generated$2.callExpression;
  }
});
Object.defineProperty(exports, "CatchClause", {
  enumerable: true,
  get: function () {
    return generated$2.catchClause;
  }
});
Object.defineProperty(exports, "ClassAccessorProperty", {
  enumerable: true,
  get: function () {
    return generated$2.classAccessorProperty;
  }
});
Object.defineProperty(exports, "ClassBody", {
  enumerable: true,
  get: function () {
    return generated$2.classBody;
  }
});
Object.defineProperty(exports, "ClassDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.classDeclaration;
  }
});
Object.defineProperty(exports, "ClassExpression", {
  enumerable: true,
  get: function () {
    return generated$2.classExpression;
  }
});
Object.defineProperty(exports, "ClassImplements", {
  enumerable: true,
  get: function () {
    return generated$2.classImplements;
  }
});
Object.defineProperty(exports, "ClassMethod", {
  enumerable: true,
  get: function () {
    return generated$2.classMethod;
  }
});
Object.defineProperty(exports, "ClassPrivateMethod", {
  enumerable: true,
  get: function () {
    return generated$2.classPrivateMethod;
  }
});
Object.defineProperty(exports, "ClassPrivateProperty", {
  enumerable: true,
  get: function () {
    return generated$2.classPrivateProperty;
  }
});
Object.defineProperty(exports, "ClassProperty", {
  enumerable: true,
  get: function () {
    return generated$2.classProperty;
  }
});
Object.defineProperty(exports, "ConditionalExpression", {
  enumerable: true,
  get: function () {
    return generated$2.conditionalExpression;
  }
});
Object.defineProperty(exports, "ContinueStatement", {
  enumerable: true,
  get: function () {
    return generated$2.continueStatement;
  }
});
Object.defineProperty(exports, "DebuggerStatement", {
  enumerable: true,
  get: function () {
    return generated$2.debuggerStatement;
  }
});
Object.defineProperty(exports, "DecimalLiteral", {
  enumerable: true,
  get: function () {
    return generated$2.decimalLiteral;
  }
});
Object.defineProperty(exports, "DeclareClass", {
  enumerable: true,
  get: function () {
    return generated$2.declareClass;
  }
});
Object.defineProperty(exports, "DeclareExportAllDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.declareExportAllDeclaration;
  }
});
Object.defineProperty(exports, "DeclareExportDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.declareExportDeclaration;
  }
});
Object.defineProperty(exports, "DeclareFunction", {
  enumerable: true,
  get: function () {
    return generated$2.declareFunction;
  }
});
Object.defineProperty(exports, "DeclareInterface", {
  enumerable: true,
  get: function () {
    return generated$2.declareInterface;
  }
});
Object.defineProperty(exports, "DeclareModule", {
  enumerable: true,
  get: function () {
    return generated$2.declareModule;
  }
});
Object.defineProperty(exports, "DeclareModuleExports", {
  enumerable: true,
  get: function () {
    return generated$2.declareModuleExports;
  }
});
Object.defineProperty(exports, "DeclareOpaqueType", {
  enumerable: true,
  get: function () {
    return generated$2.declareOpaqueType;
  }
});
Object.defineProperty(exports, "DeclareTypeAlias", {
  enumerable: true,
  get: function () {
    return generated$2.declareTypeAlias;
  }
});
Object.defineProperty(exports, "DeclareVariable", {
  enumerable: true,
  get: function () {
    return generated$2.declareVariable;
  }
});
Object.defineProperty(exports, "DeclaredPredicate", {
  enumerable: true,
  get: function () {
    return generated$2.declaredPredicate;
  }
});
Object.defineProperty(exports, "Decorator", {
  enumerable: true,
  get: function () {
    return generated$2.decorator;
  }
});
Object.defineProperty(exports, "Directive", {
  enumerable: true,
  get: function () {
    return generated$2.directive;
  }
});
Object.defineProperty(exports, "DirectiveLiteral", {
  enumerable: true,
  get: function () {
    return generated$2.directiveLiteral;
  }
});
Object.defineProperty(exports, "DoExpression", {
  enumerable: true,
  get: function () {
    return generated$2.doExpression;
  }
});
Object.defineProperty(exports, "DoWhileStatement", {
  enumerable: true,
  get: function () {
    return generated$2.doWhileStatement;
  }
});
Object.defineProperty(exports, "EmptyStatement", {
  enumerable: true,
  get: function () {
    return generated$2.emptyStatement;
  }
});
Object.defineProperty(exports, "EmptyTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.emptyTypeAnnotation;
  }
});
Object.defineProperty(exports, "EnumBooleanBody", {
  enumerable: true,
  get: function () {
    return generated$2.enumBooleanBody;
  }
});
Object.defineProperty(exports, "EnumBooleanMember", {
  enumerable: true,
  get: function () {
    return generated$2.enumBooleanMember;
  }
});
Object.defineProperty(exports, "EnumDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.enumDeclaration;
  }
});
Object.defineProperty(exports, "EnumDefaultedMember", {
  enumerable: true,
  get: function () {
    return generated$2.enumDefaultedMember;
  }
});
Object.defineProperty(exports, "EnumNumberBody", {
  enumerable: true,
  get: function () {
    return generated$2.enumNumberBody;
  }
});
Object.defineProperty(exports, "EnumNumberMember", {
  enumerable: true,
  get: function () {
    return generated$2.enumNumberMember;
  }
});
Object.defineProperty(exports, "EnumStringBody", {
  enumerable: true,
  get: function () {
    return generated$2.enumStringBody;
  }
});
Object.defineProperty(exports, "EnumStringMember", {
  enumerable: true,
  get: function () {
    return generated$2.enumStringMember;
  }
});
Object.defineProperty(exports, "EnumSymbolBody", {
  enumerable: true,
  get: function () {
    return generated$2.enumSymbolBody;
  }
});
Object.defineProperty(exports, "ExistsTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.existsTypeAnnotation;
  }
});
Object.defineProperty(exports, "ExportAllDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.exportAllDeclaration;
  }
});
Object.defineProperty(exports, "ExportDefaultDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.exportDefaultDeclaration;
  }
});
Object.defineProperty(exports, "ExportDefaultSpecifier", {
  enumerable: true,
  get: function () {
    return generated$2.exportDefaultSpecifier;
  }
});
Object.defineProperty(exports, "ExportNamedDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.exportNamedDeclaration;
  }
});
Object.defineProperty(exports, "ExportNamespaceSpecifier", {
  enumerable: true,
  get: function () {
    return generated$2.exportNamespaceSpecifier;
  }
});
Object.defineProperty(exports, "ExportSpecifier", {
  enumerable: true,
  get: function () {
    return generated$2.exportSpecifier;
  }
});
Object.defineProperty(exports, "ExpressionStatement", {
  enumerable: true,
  get: function () {
    return generated$2.expressionStatement;
  }
});
Object.defineProperty(exports, "File", {
  enumerable: true,
  get: function () {
    return generated$2.file;
  }
});
Object.defineProperty(exports, "ForInStatement", {
  enumerable: true,
  get: function () {
    return generated$2.forInStatement;
  }
});
Object.defineProperty(exports, "ForOfStatement", {
  enumerable: true,
  get: function () {
    return generated$2.forOfStatement;
  }
});
Object.defineProperty(exports, "ForStatement", {
  enumerable: true,
  get: function () {
    return generated$2.forStatement;
  }
});
Object.defineProperty(exports, "FunctionDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.functionDeclaration;
  }
});
Object.defineProperty(exports, "FunctionExpression", {
  enumerable: true,
  get: function () {
    return generated$2.functionExpression;
  }
});
Object.defineProperty(exports, "FunctionTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.functionTypeAnnotation;
  }
});
Object.defineProperty(exports, "FunctionTypeParam", {
  enumerable: true,
  get: function () {
    return generated$2.functionTypeParam;
  }
});
Object.defineProperty(exports, "GenericTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.genericTypeAnnotation;
  }
});
Object.defineProperty(exports, "Identifier", {
  enumerable: true,
  get: function () {
    return generated$2.identifier;
  }
});
Object.defineProperty(exports, "IfStatement", {
  enumerable: true,
  get: function () {
    return generated$2.ifStatement;
  }
});
Object.defineProperty(exports, "Import", {
  enumerable: true,
  get: function () {
    return generated$2.import;
  }
});
Object.defineProperty(exports, "ImportAttribute", {
  enumerable: true,
  get: function () {
    return generated$2.importAttribute;
  }
});
Object.defineProperty(exports, "ImportDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.importDeclaration;
  }
});
Object.defineProperty(exports, "ImportDefaultSpecifier", {
  enumerable: true,
  get: function () {
    return generated$2.importDefaultSpecifier;
  }
});
Object.defineProperty(exports, "ImportExpression", {
  enumerable: true,
  get: function () {
    return generated$2.importExpression;
  }
});
Object.defineProperty(exports, "ImportNamespaceSpecifier", {
  enumerable: true,
  get: function () {
    return generated$2.importNamespaceSpecifier;
  }
});
Object.defineProperty(exports, "ImportSpecifier", {
  enumerable: true,
  get: function () {
    return generated$2.importSpecifier;
  }
});
Object.defineProperty(exports, "IndexedAccessType", {
  enumerable: true,
  get: function () {
    return generated$2.indexedAccessType;
  }
});
Object.defineProperty(exports, "InferredPredicate", {
  enumerable: true,
  get: function () {
    return generated$2.inferredPredicate;
  }
});
Object.defineProperty(exports, "InterfaceDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.interfaceDeclaration;
  }
});
Object.defineProperty(exports, "InterfaceExtends", {
  enumerable: true,
  get: function () {
    return generated$2.interfaceExtends;
  }
});
Object.defineProperty(exports, "InterfaceTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.interfaceTypeAnnotation;
  }
});
Object.defineProperty(exports, "InterpreterDirective", {
  enumerable: true,
  get: function () {
    return generated$2.interpreterDirective;
  }
});
Object.defineProperty(exports, "IntersectionTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.intersectionTypeAnnotation;
  }
});
Object.defineProperty(exports, "JSXAttribute", {
  enumerable: true,
  get: function () {
    return generated$2.jsxAttribute;
  }
});
Object.defineProperty(exports, "JSXClosingElement", {
  enumerable: true,
  get: function () {
    return generated$2.jsxClosingElement;
  }
});
Object.defineProperty(exports, "JSXClosingFragment", {
  enumerable: true,
  get: function () {
    return generated$2.jsxClosingFragment;
  }
});
Object.defineProperty(exports, "JSXElement", {
  enumerable: true,
  get: function () {
    return generated$2.jsxElement;
  }
});
Object.defineProperty(exports, "JSXEmptyExpression", {
  enumerable: true,
  get: function () {
    return generated$2.jsxEmptyExpression;
  }
});
Object.defineProperty(exports, "JSXExpressionContainer", {
  enumerable: true,
  get: function () {
    return generated$2.jsxExpressionContainer;
  }
});
Object.defineProperty(exports, "JSXFragment", {
  enumerable: true,
  get: function () {
    return generated$2.jsxFragment;
  }
});
Object.defineProperty(exports, "JSXIdentifier", {
  enumerable: true,
  get: function () {
    return generated$2.jsxIdentifier;
  }
});
Object.defineProperty(exports, "JSXMemberExpression", {
  enumerable: true,
  get: function () {
    return generated$2.jsxMemberExpression;
  }
});
Object.defineProperty(exports, "JSXNamespacedName", {
  enumerable: true,
  get: function () {
    return generated$2.jsxNamespacedName;
  }
});
Object.defineProperty(exports, "JSXOpeningElement", {
  enumerable: true,
  get: function () {
    return generated$2.jsxOpeningElement;
  }
});
Object.defineProperty(exports, "JSXOpeningFragment", {
  enumerable: true,
  get: function () {
    return generated$2.jsxOpeningFragment;
  }
});
Object.defineProperty(exports, "JSXSpreadAttribute", {
  enumerable: true,
  get: function () {
    return generated$2.jsxSpreadAttribute;
  }
});
Object.defineProperty(exports, "JSXSpreadChild", {
  enumerable: true,
  get: function () {
    return generated$2.jsxSpreadChild;
  }
});
Object.defineProperty(exports, "JSXText", {
  enumerable: true,
  get: function () {
    return generated$2.jsxText;
  }
});
Object.defineProperty(exports, "LabeledStatement", {
  enumerable: true,
  get: function () {
    return generated$2.labeledStatement;
  }
});
Object.defineProperty(exports, "LogicalExpression", {
  enumerable: true,
  get: function () {
    return generated$2.logicalExpression;
  }
});
Object.defineProperty(exports, "MemberExpression", {
  enumerable: true,
  get: function () {
    return generated$2.memberExpression;
  }
});
Object.defineProperty(exports, "MetaProperty", {
  enumerable: true,
  get: function () {
    return generated$2.metaProperty;
  }
});
Object.defineProperty(exports, "MixedTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.mixedTypeAnnotation;
  }
});
Object.defineProperty(exports, "ModuleExpression", {
  enumerable: true,
  get: function () {
    return generated$2.moduleExpression;
  }
});
Object.defineProperty(exports, "NewExpression", {
  enumerable: true,
  get: function () {
    return generated$2.newExpression;
  }
});
Object.defineProperty(exports, "Noop", {
  enumerable: true,
  get: function () {
    return generated$2.noop;
  }
});
Object.defineProperty(exports, "NullLiteral", {
  enumerable: true,
  get: function () {
    return generated$2.nullLiteral;
  }
});
Object.defineProperty(exports, "NullLiteralTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.nullLiteralTypeAnnotation;
  }
});
Object.defineProperty(exports, "NullableTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.nullableTypeAnnotation;
  }
});
Object.defineProperty(exports, "NumberLiteral", {
  enumerable: true,
  get: function () {
    return generated$2.numberLiteral;
  }
});
Object.defineProperty(exports, "NumberLiteralTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.numberLiteralTypeAnnotation;
  }
});
Object.defineProperty(exports, "NumberTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.numberTypeAnnotation;
  }
});
Object.defineProperty(exports, "NumericLiteral", {
  enumerable: true,
  get: function () {
    return generated$2.numericLiteral;
  }
});
Object.defineProperty(exports, "ObjectExpression", {
  enumerable: true,
  get: function () {
    return generated$2.objectExpression;
  }
});
Object.defineProperty(exports, "ObjectMethod", {
  enumerable: true,
  get: function () {
    return generated$2.objectMethod;
  }
});
Object.defineProperty(exports, "ObjectPattern", {
  enumerable: true,
  get: function () {
    return generated$2.objectPattern;
  }
});
Object.defineProperty(exports, "ObjectProperty", {
  enumerable: true,
  get: function () {
    return generated$2.objectProperty;
  }
});
Object.defineProperty(exports, "ObjectTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.objectTypeAnnotation;
  }
});
Object.defineProperty(exports, "ObjectTypeCallProperty", {
  enumerable: true,
  get: function () {
    return generated$2.objectTypeCallProperty;
  }
});
Object.defineProperty(exports, "ObjectTypeIndexer", {
  enumerable: true,
  get: function () {
    return generated$2.objectTypeIndexer;
  }
});
Object.defineProperty(exports, "ObjectTypeInternalSlot", {
  enumerable: true,
  get: function () {
    return generated$2.objectTypeInternalSlot;
  }
});
Object.defineProperty(exports, "ObjectTypeProperty", {
  enumerable: true,
  get: function () {
    return generated$2.objectTypeProperty;
  }
});
Object.defineProperty(exports, "ObjectTypeSpreadProperty", {
  enumerable: true,
  get: function () {
    return generated$2.objectTypeSpreadProperty;
  }
});
Object.defineProperty(exports, "OpaqueType", {
  enumerable: true,
  get: function () {
    return generated$2.opaqueType;
  }
});
Object.defineProperty(exports, "OptionalCallExpression", {
  enumerable: true,
  get: function () {
    return generated$2.optionalCallExpression;
  }
});
Object.defineProperty(exports, "OptionalIndexedAccessType", {
  enumerable: true,
  get: function () {
    return generated$2.optionalIndexedAccessType;
  }
});
Object.defineProperty(exports, "OptionalMemberExpression", {
  enumerable: true,
  get: function () {
    return generated$2.optionalMemberExpression;
  }
});
Object.defineProperty(exports, "ParenthesizedExpression", {
  enumerable: true,
  get: function () {
    return generated$2.parenthesizedExpression;
  }
});
Object.defineProperty(exports, "PipelineBareFunction", {
  enumerable: true,
  get: function () {
    return generated$2.pipelineBareFunction;
  }
});
Object.defineProperty(exports, "PipelinePrimaryTopicReference", {
  enumerable: true,
  get: function () {
    return generated$2.pipelinePrimaryTopicReference;
  }
});
Object.defineProperty(exports, "PipelineTopicExpression", {
  enumerable: true,
  get: function () {
    return generated$2.pipelineTopicExpression;
  }
});
Object.defineProperty(exports, "Placeholder", {
  enumerable: true,
  get: function () {
    return generated$2.placeholder;
  }
});
Object.defineProperty(exports, "PrivateName", {
  enumerable: true,
  get: function () {
    return generated$2.privateName;
  }
});
Object.defineProperty(exports, "Program", {
  enumerable: true,
  get: function () {
    return generated$2.program;
  }
});
Object.defineProperty(exports, "QualifiedTypeIdentifier", {
  enumerable: true,
  get: function () {
    return generated$2.qualifiedTypeIdentifier;
  }
});
Object.defineProperty(exports, "RecordExpression", {
  enumerable: true,
  get: function () {
    return generated$2.recordExpression;
  }
});
Object.defineProperty(exports, "RegExpLiteral", {
  enumerable: true,
  get: function () {
    return generated$2.regExpLiteral;
  }
});
Object.defineProperty(exports, "RegexLiteral", {
  enumerable: true,
  get: function () {
    return generated$2.regexLiteral;
  }
});
Object.defineProperty(exports, "RestElement", {
  enumerable: true,
  get: function () {
    return generated$2.restElement;
  }
});
Object.defineProperty(exports, "RestProperty", {
  enumerable: true,
  get: function () {
    return generated$2.restProperty;
  }
});
Object.defineProperty(exports, "ReturnStatement", {
  enumerable: true,
  get: function () {
    return generated$2.returnStatement;
  }
});
Object.defineProperty(exports, "SequenceExpression", {
  enumerable: true,
  get: function () {
    return generated$2.sequenceExpression;
  }
});
Object.defineProperty(exports, "SpreadElement", {
  enumerable: true,
  get: function () {
    return generated$2.spreadElement;
  }
});
Object.defineProperty(exports, "SpreadProperty", {
  enumerable: true,
  get: function () {
    return generated$2.spreadProperty;
  }
});
Object.defineProperty(exports, "StaticBlock", {
  enumerable: true,
  get: function () {
    return generated$2.staticBlock;
  }
});
Object.defineProperty(exports, "StringLiteral", {
  enumerable: true,
  get: function () {
    return generated$2.stringLiteral;
  }
});
Object.defineProperty(exports, "StringLiteralTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.stringLiteralTypeAnnotation;
  }
});
Object.defineProperty(exports, "StringTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.stringTypeAnnotation;
  }
});
Object.defineProperty(exports, "Super", {
  enumerable: true,
  get: function () {
    return generated$2.super;
  }
});
Object.defineProperty(exports, "SwitchCase", {
  enumerable: true,
  get: function () {
    return generated$2.switchCase;
  }
});
Object.defineProperty(exports, "SwitchStatement", {
  enumerable: true,
  get: function () {
    return generated$2.switchStatement;
  }
});
Object.defineProperty(exports, "SymbolTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.symbolTypeAnnotation;
  }
});
Object.defineProperty(exports, "TSAnyKeyword", {
  enumerable: true,
  get: function () {
    return generated$2.tsAnyKeyword;
  }
});
Object.defineProperty(exports, "TSArrayType", {
  enumerable: true,
  get: function () {
    return generated$2.tsArrayType;
  }
});
Object.defineProperty(exports, "TSAsExpression", {
  enumerable: true,
  get: function () {
    return generated$2.tsAsExpression;
  }
});
Object.defineProperty(exports, "TSBigIntKeyword", {
  enumerable: true,
  get: function () {
    return generated$2.tsBigIntKeyword;
  }
});
Object.defineProperty(exports, "TSBooleanKeyword", {
  enumerable: true,
  get: function () {
    return generated$2.tsBooleanKeyword;
  }
});
Object.defineProperty(exports, "TSCallSignatureDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.tsCallSignatureDeclaration;
  }
});
Object.defineProperty(exports, "TSConditionalType", {
  enumerable: true,
  get: function () {
    return generated$2.tsConditionalType;
  }
});
Object.defineProperty(exports, "TSConstructSignatureDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.tsConstructSignatureDeclaration;
  }
});
Object.defineProperty(exports, "TSConstructorType", {
  enumerable: true,
  get: function () {
    return generated$2.tsConstructorType;
  }
});
Object.defineProperty(exports, "TSDeclareFunction", {
  enumerable: true,
  get: function () {
    return generated$2.tsDeclareFunction;
  }
});
Object.defineProperty(exports, "TSDeclareMethod", {
  enumerable: true,
  get: function () {
    return generated$2.tsDeclareMethod;
  }
});
Object.defineProperty(exports, "TSEnumDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.tsEnumDeclaration;
  }
});
Object.defineProperty(exports, "TSEnumMember", {
  enumerable: true,
  get: function () {
    return generated$2.tsEnumMember;
  }
});
Object.defineProperty(exports, "TSExportAssignment", {
  enumerable: true,
  get: function () {
    return generated$2.tsExportAssignment;
  }
});
Object.defineProperty(exports, "TSExpressionWithTypeArguments", {
  enumerable: true,
  get: function () {
    return generated$2.tsExpressionWithTypeArguments;
  }
});
Object.defineProperty(exports, "TSExternalModuleReference", {
  enumerable: true,
  get: function () {
    return generated$2.tsExternalModuleReference;
  }
});
Object.defineProperty(exports, "TSFunctionType", {
  enumerable: true,
  get: function () {
    return generated$2.tsFunctionType;
  }
});
Object.defineProperty(exports, "TSImportEqualsDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.tsImportEqualsDeclaration;
  }
});
Object.defineProperty(exports, "TSImportType", {
  enumerable: true,
  get: function () {
    return generated$2.tsImportType;
  }
});
Object.defineProperty(exports, "TSIndexSignature", {
  enumerable: true,
  get: function () {
    return generated$2.tsIndexSignature;
  }
});
Object.defineProperty(exports, "TSIndexedAccessType", {
  enumerable: true,
  get: function () {
    return generated$2.tsIndexedAccessType;
  }
});
Object.defineProperty(exports, "TSInferType", {
  enumerable: true,
  get: function () {
    return generated$2.tsInferType;
  }
});
Object.defineProperty(exports, "TSInstantiationExpression", {
  enumerable: true,
  get: function () {
    return generated$2.tsInstantiationExpression;
  }
});
Object.defineProperty(exports, "TSInterfaceBody", {
  enumerable: true,
  get: function () {
    return generated$2.tsInterfaceBody;
  }
});
Object.defineProperty(exports, "TSInterfaceDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.tsInterfaceDeclaration;
  }
});
Object.defineProperty(exports, "TSIntersectionType", {
  enumerable: true,
  get: function () {
    return generated$2.tsIntersectionType;
  }
});
Object.defineProperty(exports, "TSIntrinsicKeyword", {
  enumerable: true,
  get: function () {
    return generated$2.tsIntrinsicKeyword;
  }
});
Object.defineProperty(exports, "TSLiteralType", {
  enumerable: true,
  get: function () {
    return generated$2.tsLiteralType;
  }
});
Object.defineProperty(exports, "TSMappedType", {
  enumerable: true,
  get: function () {
    return generated$2.tsMappedType;
  }
});
Object.defineProperty(exports, "TSMethodSignature", {
  enumerable: true,
  get: function () {
    return generated$2.tsMethodSignature;
  }
});
Object.defineProperty(exports, "TSModuleBlock", {
  enumerable: true,
  get: function () {
    return generated$2.tsModuleBlock;
  }
});
Object.defineProperty(exports, "TSModuleDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.tsModuleDeclaration;
  }
});
Object.defineProperty(exports, "TSNamedTupleMember", {
  enumerable: true,
  get: function () {
    return generated$2.tsNamedTupleMember;
  }
});
Object.defineProperty(exports, "TSNamespaceExportDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.tsNamespaceExportDeclaration;
  }
});
Object.defineProperty(exports, "TSNeverKeyword", {
  enumerable: true,
  get: function () {
    return generated$2.tsNeverKeyword;
  }
});
Object.defineProperty(exports, "TSNonNullExpression", {
  enumerable: true,
  get: function () {
    return generated$2.tsNonNullExpression;
  }
});
Object.defineProperty(exports, "TSNullKeyword", {
  enumerable: true,
  get: function () {
    return generated$2.tsNullKeyword;
  }
});
Object.defineProperty(exports, "TSNumberKeyword", {
  enumerable: true,
  get: function () {
    return generated$2.tsNumberKeyword;
  }
});
Object.defineProperty(exports, "TSObjectKeyword", {
  enumerable: true,
  get: function () {
    return generated$2.tsObjectKeyword;
  }
});
Object.defineProperty(exports, "TSOptionalType", {
  enumerable: true,
  get: function () {
    return generated$2.tsOptionalType;
  }
});
Object.defineProperty(exports, "TSParameterProperty", {
  enumerable: true,
  get: function () {
    return generated$2.tsParameterProperty;
  }
});
Object.defineProperty(exports, "TSParenthesizedType", {
  enumerable: true,
  get: function () {
    return generated$2.tsParenthesizedType;
  }
});
Object.defineProperty(exports, "TSPropertySignature", {
  enumerable: true,
  get: function () {
    return generated$2.tsPropertySignature;
  }
});
Object.defineProperty(exports, "TSQualifiedName", {
  enumerable: true,
  get: function () {
    return generated$2.tsQualifiedName;
  }
});
Object.defineProperty(exports, "TSRestType", {
  enumerable: true,
  get: function () {
    return generated$2.tsRestType;
  }
});
Object.defineProperty(exports, "TSSatisfiesExpression", {
  enumerable: true,
  get: function () {
    return generated$2.tsSatisfiesExpression;
  }
});
Object.defineProperty(exports, "TSStringKeyword", {
  enumerable: true,
  get: function () {
    return generated$2.tsStringKeyword;
  }
});
Object.defineProperty(exports, "TSSymbolKeyword", {
  enumerable: true,
  get: function () {
    return generated$2.tsSymbolKeyword;
  }
});
Object.defineProperty(exports, "TSThisType", {
  enumerable: true,
  get: function () {
    return generated$2.tsThisType;
  }
});
Object.defineProperty(exports, "TSTupleType", {
  enumerable: true,
  get: function () {
    return generated$2.tsTupleType;
  }
});
Object.defineProperty(exports, "TSTypeAliasDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.tsTypeAliasDeclaration;
  }
});
Object.defineProperty(exports, "TSTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.tsTypeAnnotation;
  }
});
Object.defineProperty(exports, "TSTypeAssertion", {
  enumerable: true,
  get: function () {
    return generated$2.tsTypeAssertion;
  }
});
Object.defineProperty(exports, "TSTypeLiteral", {
  enumerable: true,
  get: function () {
    return generated$2.tsTypeLiteral;
  }
});
Object.defineProperty(exports, "TSTypeOperator", {
  enumerable: true,
  get: function () {
    return generated$2.tsTypeOperator;
  }
});
Object.defineProperty(exports, "TSTypeParameter", {
  enumerable: true,
  get: function () {
    return generated$2.tsTypeParameter;
  }
});
Object.defineProperty(exports, "TSTypeParameterDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.tsTypeParameterDeclaration;
  }
});
Object.defineProperty(exports, "TSTypeParameterInstantiation", {
  enumerable: true,
  get: function () {
    return generated$2.tsTypeParameterInstantiation;
  }
});
Object.defineProperty(exports, "TSTypePredicate", {
  enumerable: true,
  get: function () {
    return generated$2.tsTypePredicate;
  }
});
Object.defineProperty(exports, "TSTypeQuery", {
  enumerable: true,
  get: function () {
    return generated$2.tsTypeQuery;
  }
});
Object.defineProperty(exports, "TSTypeReference", {
  enumerable: true,
  get: function () {
    return generated$2.tsTypeReference;
  }
});
Object.defineProperty(exports, "TSUndefinedKeyword", {
  enumerable: true,
  get: function () {
    return generated$2.tsUndefinedKeyword;
  }
});
Object.defineProperty(exports, "TSUnionType", {
  enumerable: true,
  get: function () {
    return generated$2.tsUnionType;
  }
});
Object.defineProperty(exports, "TSUnknownKeyword", {
  enumerable: true,
  get: function () {
    return generated$2.tsUnknownKeyword;
  }
});
Object.defineProperty(exports, "TSVoidKeyword", {
  enumerable: true,
  get: function () {
    return generated$2.tsVoidKeyword;
  }
});
Object.defineProperty(exports, "TaggedTemplateExpression", {
  enumerable: true,
  get: function () {
    return generated$2.taggedTemplateExpression;
  }
});
Object.defineProperty(exports, "TemplateElement", {
  enumerable: true,
  get: function () {
    return generated$2.templateElement;
  }
});
Object.defineProperty(exports, "TemplateLiteral", {
  enumerable: true,
  get: function () {
    return generated$2.templateLiteral;
  }
});
Object.defineProperty(exports, "ThisExpression", {
  enumerable: true,
  get: function () {
    return generated$2.thisExpression;
  }
});
Object.defineProperty(exports, "ThisTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.thisTypeAnnotation;
  }
});
Object.defineProperty(exports, "ThrowStatement", {
  enumerable: true,
  get: function () {
    return generated$2.throwStatement;
  }
});
Object.defineProperty(exports, "TopicReference", {
  enumerable: true,
  get: function () {
    return generated$2.topicReference;
  }
});
Object.defineProperty(exports, "TryStatement", {
  enumerable: true,
  get: function () {
    return generated$2.tryStatement;
  }
});
Object.defineProperty(exports, "TupleExpression", {
  enumerable: true,
  get: function () {
    return generated$2.tupleExpression;
  }
});
Object.defineProperty(exports, "TupleTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.tupleTypeAnnotation;
  }
});
Object.defineProperty(exports, "TypeAlias", {
  enumerable: true,
  get: function () {
    return generated$2.typeAlias;
  }
});
Object.defineProperty(exports, "TypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.typeAnnotation;
  }
});
Object.defineProperty(exports, "TypeCastExpression", {
  enumerable: true,
  get: function () {
    return generated$2.typeCastExpression;
  }
});
Object.defineProperty(exports, "TypeParameter", {
  enumerable: true,
  get: function () {
    return generated$2.typeParameter;
  }
});
Object.defineProperty(exports, "TypeParameterDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.typeParameterDeclaration;
  }
});
Object.defineProperty(exports, "TypeParameterInstantiation", {
  enumerable: true,
  get: function () {
    return generated$2.typeParameterInstantiation;
  }
});
Object.defineProperty(exports, "TypeofTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.typeofTypeAnnotation;
  }
});
Object.defineProperty(exports, "UnaryExpression", {
  enumerable: true,
  get: function () {
    return generated$2.unaryExpression;
  }
});
Object.defineProperty(exports, "UnionTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.unionTypeAnnotation;
  }
});
Object.defineProperty(exports, "UpdateExpression", {
  enumerable: true,
  get: function () {
    return generated$2.updateExpression;
  }
});
Object.defineProperty(exports, "V8IntrinsicIdentifier", {
  enumerable: true,
  get: function () {
    return generated$2.v8IntrinsicIdentifier;
  }
});
Object.defineProperty(exports, "VariableDeclaration", {
  enumerable: true,
  get: function () {
    return generated$2.variableDeclaration;
  }
});
Object.defineProperty(exports, "VariableDeclarator", {
  enumerable: true,
  get: function () {
    return generated$2.variableDeclarator;
  }
});
Object.defineProperty(exports, "Variance", {
  enumerable: true,
  get: function () {
    return generated$2.variance;
  }
});
Object.defineProperty(exports, "VoidTypeAnnotation", {
  enumerable: true,
  get: function () {
    return generated$2.voidTypeAnnotation;
  }
});
Object.defineProperty(exports, "WhileStatement", {
  enumerable: true,
  get: function () {
    return generated$2.whileStatement;
  }
});
Object.defineProperty(exports, "WithStatement", {
  enumerable: true,
  get: function () {
    return generated$2.withStatement;
  }
});
Object.defineProperty(exports, "YieldExpression", {
  enumerable: true,
  get: function () {
    return generated$2.yieldExpression;
  }
});



});

unwrapExports(uppercase);

var productions = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildUndefinedNode = buildUndefinedNode;

function buildUndefinedNode() {
  return (0, generated$2.unaryExpression)("void", (0, generated$2.numericLiteral)(0), true);
}


});

unwrapExports(productions);
productions.buildUndefinedNode;

var cloneNode_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cloneNode;


const {
  hasOwn
} = {
  hasOwn: Function.call.bind(Object.prototype.hasOwnProperty)
};
function cloneIfNode(obj, deep, withoutLoc, commentsCache) {
  if (obj && typeof obj.type === "string") {
    return cloneNodeInternal(obj, deep, withoutLoc, commentsCache);
  }
  return obj;
}
function cloneIfNodeOrArray(obj, deep, withoutLoc, commentsCache) {
  if (Array.isArray(obj)) {
    return obj.map(node => cloneIfNode(node, deep, withoutLoc, commentsCache));
  }
  return cloneIfNode(obj, deep, withoutLoc, commentsCache);
}
function cloneNode(node, deep = true, withoutLoc = false) {
  return cloneNodeInternal(node, deep, withoutLoc, new Map());
}
function cloneNodeInternal(node, deep = true, withoutLoc = false, commentsCache) {
  if (!node) return node;
  const {
    type
  } = node;
  const newNode = {
    type: node.type
  };
  if ((0, generated$3.isIdentifier)(node)) {
    newNode.name = node.name;
    if (hasOwn(node, "optional") && typeof node.optional === "boolean") {
      newNode.optional = node.optional;
    }
    if (hasOwn(node, "typeAnnotation")) {
      newNode.typeAnnotation = deep ? cloneIfNodeOrArray(node.typeAnnotation, true, withoutLoc, commentsCache) : node.typeAnnotation;
    }
  } else if (!hasOwn(definitions.NODE_FIELDS, type)) {
    throw new Error(`Unknown node type: "${type}"`);
  } else {
    for (const field of Object.keys(definitions.NODE_FIELDS[type])) {
      if (hasOwn(node, field)) {
        if (deep) {
          newNode[field] = (0, generated$3.isFile)(node) && field === "comments" ? maybeCloneComments(node.comments, deep, withoutLoc, commentsCache) : cloneIfNodeOrArray(node[field], true, withoutLoc, commentsCache);
        } else {
          newNode[field] = node[field];
        }
      }
    }
  }
  if (hasOwn(node, "loc")) {
    if (withoutLoc) {
      newNode.loc = null;
    } else {
      newNode.loc = node.loc;
    }
  }
  if (hasOwn(node, "leadingComments")) {
    newNode.leadingComments = maybeCloneComments(node.leadingComments, deep, withoutLoc, commentsCache);
  }
  if (hasOwn(node, "innerComments")) {
    newNode.innerComments = maybeCloneComments(node.innerComments, deep, withoutLoc, commentsCache);
  }
  if (hasOwn(node, "trailingComments")) {
    newNode.trailingComments = maybeCloneComments(node.trailingComments, deep, withoutLoc, commentsCache);
  }
  if (hasOwn(node, "extra")) {
    newNode.extra = Object.assign({}, node.extra);
  }
  return newNode;
}
function maybeCloneComments(comments, deep, withoutLoc, commentsCache) {
  if (!comments || !deep) {
    return comments;
  }
  return comments.map(comment => {
    const cache = commentsCache.get(comment);
    if (cache) return cache;
    const {
      type,
      value,
      loc
    } = comment;
    const ret = {
      type,
      value,
      loc
    };
    if (withoutLoc) {
      ret.loc = null;
    }
    commentsCache.set(comment, ret);
    return ret;
  });
}


});

unwrapExports(cloneNode_1);

var clone_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clone;

function clone(node) {
  return (0, cloneNode_1.default)(node, false);
}


});

unwrapExports(clone_1);

var cloneDeep_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cloneDeep;

function cloneDeep(node) {
  return (0, cloneNode_1.default)(node);
}


});

unwrapExports(cloneDeep_1);

var cloneDeepWithoutLoc_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cloneDeepWithoutLoc;

function cloneDeepWithoutLoc(node) {
  return (0, cloneNode_1.default)(node, true, true);
}


});

unwrapExports(cloneDeepWithoutLoc_1);

var cloneWithoutLoc_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cloneWithoutLoc;

function cloneWithoutLoc(node) {
  return (0, cloneNode_1.default)(node, false, true);
}


});

unwrapExports(cloneWithoutLoc_1);

var addComments_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addComments;
function addComments(node, type, comments) {
  if (!comments || !node) return node;
  const key = `${type}Comments`;
  if (node[key]) {
    if (type === "leading") {
      node[key] = comments.concat(node[key]);
    } else {
      node[key].push(...comments);
    }
  } else {
    node[key] = comments;
  }
  return node;
}


});

unwrapExports(addComments_1);

var addComment_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addComment;

function addComment(node, type, content, line) {
  return (0, addComments_1.default)(node, type, [{
    type: line ? "CommentLine" : "CommentBlock",
    value: content
  }]);
}


});

unwrapExports(addComment_1);

var inherit_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inherit;
function inherit(key, child, parent) {
  if (child && parent) {
    child[key] = Array.from(new Set([].concat(child[key], parent[key]).filter(Boolean)));
  }
}


});

unwrapExports(inherit_1);

var inheritInnerComments_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inheritInnerComments;

function inheritInnerComments(child, parent) {
  (0, inherit_1.default)("innerComments", child, parent);
}


});

unwrapExports(inheritInnerComments_1);

var inheritLeadingComments_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inheritLeadingComments;

function inheritLeadingComments(child, parent) {
  (0, inherit_1.default)("leadingComments", child, parent);
}


});

unwrapExports(inheritLeadingComments_1);

var inheritTrailingComments_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inheritTrailingComments;

function inheritTrailingComments(child, parent) {
  (0, inherit_1.default)("trailingComments", child, parent);
}


});

unwrapExports(inheritTrailingComments_1);

var inheritsComments_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inheritsComments;



function inheritsComments(child, parent) {
  (0, inheritTrailingComments_1.default)(child, parent);
  (0, inheritLeadingComments_1.default)(child, parent);
  (0, inheritInnerComments_1.default)(child, parent);
  return child;
}


});

unwrapExports(inheritsComments_1);

var removeComments_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeComments;

function removeComments(node) {
  constants$1.COMMENT_KEYS.forEach(key => {
    node[key] = null;
  });
  return node;
}


});

unwrapExports(removeComments_1);

var generated = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WHILE_TYPES = exports.USERWHITESPACABLE_TYPES = exports.UNARYLIKE_TYPES = exports.TYPESCRIPT_TYPES = exports.TSTYPE_TYPES = exports.TSTYPEELEMENT_TYPES = exports.TSENTITYNAME_TYPES = exports.TSBASETYPE_TYPES = exports.TERMINATORLESS_TYPES = exports.STATEMENT_TYPES = exports.STANDARDIZED_TYPES = exports.SCOPABLE_TYPES = exports.PUREISH_TYPES = exports.PROPERTY_TYPES = exports.PRIVATE_TYPES = exports.PATTERN_TYPES = exports.PATTERNLIKE_TYPES = exports.OBJECTMEMBER_TYPES = exports.MODULESPECIFIER_TYPES = exports.MODULEDECLARATION_TYPES = exports.MISCELLANEOUS_TYPES = exports.METHOD_TYPES = exports.LVAL_TYPES = exports.LOOP_TYPES = exports.LITERAL_TYPES = exports.JSX_TYPES = exports.IMPORTOREXPORTDECLARATION_TYPES = exports.IMMUTABLE_TYPES = exports.FUNCTION_TYPES = exports.FUNCTIONPARENT_TYPES = exports.FOR_TYPES = exports.FORXSTATEMENT_TYPES = exports.FLOW_TYPES = exports.FLOWTYPE_TYPES = exports.FLOWPREDICATE_TYPES = exports.FLOWDECLARATION_TYPES = exports.FLOWBASEANNOTATION_TYPES = exports.EXPRESSION_TYPES = exports.EXPRESSIONWRAPPER_TYPES = exports.EXPORTDECLARATION_TYPES = exports.ENUMMEMBER_TYPES = exports.ENUMBODY_TYPES = exports.DECLARATION_TYPES = exports.CONDITIONAL_TYPES = exports.COMPLETIONSTATEMENT_TYPES = exports.CLASS_TYPES = exports.BLOCK_TYPES = exports.BLOCKPARENT_TYPES = exports.BINARY_TYPES = exports.ACCESSOR_TYPES = void 0;

exports.STANDARDIZED_TYPES = definitions.FLIPPED_ALIAS_KEYS["Standardized"];
exports.EXPRESSION_TYPES = definitions.FLIPPED_ALIAS_KEYS["Expression"];
exports.BINARY_TYPES = definitions.FLIPPED_ALIAS_KEYS["Binary"];
exports.SCOPABLE_TYPES = definitions.FLIPPED_ALIAS_KEYS["Scopable"];
exports.BLOCKPARENT_TYPES = definitions.FLIPPED_ALIAS_KEYS["BlockParent"];
exports.BLOCK_TYPES = definitions.FLIPPED_ALIAS_KEYS["Block"];
exports.STATEMENT_TYPES = definitions.FLIPPED_ALIAS_KEYS["Statement"];
exports.TERMINATORLESS_TYPES = definitions.FLIPPED_ALIAS_KEYS["Terminatorless"];
exports.COMPLETIONSTATEMENT_TYPES = definitions.FLIPPED_ALIAS_KEYS["CompletionStatement"];
exports.CONDITIONAL_TYPES = definitions.FLIPPED_ALIAS_KEYS["Conditional"];
exports.LOOP_TYPES = definitions.FLIPPED_ALIAS_KEYS["Loop"];
exports.WHILE_TYPES = definitions.FLIPPED_ALIAS_KEYS["While"];
exports.EXPRESSIONWRAPPER_TYPES = definitions.FLIPPED_ALIAS_KEYS["ExpressionWrapper"];
exports.FOR_TYPES = definitions.FLIPPED_ALIAS_KEYS["For"];
exports.FORXSTATEMENT_TYPES = definitions.FLIPPED_ALIAS_KEYS["ForXStatement"];
exports.FUNCTION_TYPES = definitions.FLIPPED_ALIAS_KEYS["Function"];
exports.FUNCTIONPARENT_TYPES = definitions.FLIPPED_ALIAS_KEYS["FunctionParent"];
exports.PUREISH_TYPES = definitions.FLIPPED_ALIAS_KEYS["Pureish"];
exports.DECLARATION_TYPES = definitions.FLIPPED_ALIAS_KEYS["Declaration"];
exports.PATTERNLIKE_TYPES = definitions.FLIPPED_ALIAS_KEYS["PatternLike"];
exports.LVAL_TYPES = definitions.FLIPPED_ALIAS_KEYS["LVal"];
exports.TSENTITYNAME_TYPES = definitions.FLIPPED_ALIAS_KEYS["TSEntityName"];
exports.LITERAL_TYPES = definitions.FLIPPED_ALIAS_KEYS["Literal"];
exports.IMMUTABLE_TYPES = definitions.FLIPPED_ALIAS_KEYS["Immutable"];
exports.USERWHITESPACABLE_TYPES = definitions.FLIPPED_ALIAS_KEYS["UserWhitespacable"];
exports.METHOD_TYPES = definitions.FLIPPED_ALIAS_KEYS["Method"];
exports.OBJECTMEMBER_TYPES = definitions.FLIPPED_ALIAS_KEYS["ObjectMember"];
exports.PROPERTY_TYPES = definitions.FLIPPED_ALIAS_KEYS["Property"];
exports.UNARYLIKE_TYPES = definitions.FLIPPED_ALIAS_KEYS["UnaryLike"];
exports.PATTERN_TYPES = definitions.FLIPPED_ALIAS_KEYS["Pattern"];
exports.CLASS_TYPES = definitions.FLIPPED_ALIAS_KEYS["Class"];
const IMPORTOREXPORTDECLARATION_TYPES = exports.IMPORTOREXPORTDECLARATION_TYPES = definitions.FLIPPED_ALIAS_KEYS["ImportOrExportDeclaration"];
exports.EXPORTDECLARATION_TYPES = definitions.FLIPPED_ALIAS_KEYS["ExportDeclaration"];
exports.MODULESPECIFIER_TYPES = definitions.FLIPPED_ALIAS_KEYS["ModuleSpecifier"];
exports.ACCESSOR_TYPES = definitions.FLIPPED_ALIAS_KEYS["Accessor"];
exports.PRIVATE_TYPES = definitions.FLIPPED_ALIAS_KEYS["Private"];
exports.FLOW_TYPES = definitions.FLIPPED_ALIAS_KEYS["Flow"];
exports.FLOWTYPE_TYPES = definitions.FLIPPED_ALIAS_KEYS["FlowType"];
exports.FLOWBASEANNOTATION_TYPES = definitions.FLIPPED_ALIAS_KEYS["FlowBaseAnnotation"];
exports.FLOWDECLARATION_TYPES = definitions.FLIPPED_ALIAS_KEYS["FlowDeclaration"];
exports.FLOWPREDICATE_TYPES = definitions.FLIPPED_ALIAS_KEYS["FlowPredicate"];
exports.ENUMBODY_TYPES = definitions.FLIPPED_ALIAS_KEYS["EnumBody"];
exports.ENUMMEMBER_TYPES = definitions.FLIPPED_ALIAS_KEYS["EnumMember"];
exports.JSX_TYPES = definitions.FLIPPED_ALIAS_KEYS["JSX"];
exports.MISCELLANEOUS_TYPES = definitions.FLIPPED_ALIAS_KEYS["Miscellaneous"];
exports.TYPESCRIPT_TYPES = definitions.FLIPPED_ALIAS_KEYS["TypeScript"];
exports.TSTYPEELEMENT_TYPES = definitions.FLIPPED_ALIAS_KEYS["TSTypeElement"];
exports.TSTYPE_TYPES = definitions.FLIPPED_ALIAS_KEYS["TSType"];
exports.TSBASETYPE_TYPES = definitions.FLIPPED_ALIAS_KEYS["TSBaseType"];
exports.MODULEDECLARATION_TYPES = IMPORTOREXPORTDECLARATION_TYPES;


});

unwrapExports(generated);
generated.WHILE_TYPES;
generated.USERWHITESPACABLE_TYPES;
generated.UNARYLIKE_TYPES;
generated.TYPESCRIPT_TYPES;
generated.TSTYPE_TYPES;
generated.TSTYPEELEMENT_TYPES;
generated.TSENTITYNAME_TYPES;
generated.TSBASETYPE_TYPES;
generated.TERMINATORLESS_TYPES;
generated.STATEMENT_TYPES;
generated.STANDARDIZED_TYPES;
generated.SCOPABLE_TYPES;
generated.PUREISH_TYPES;
generated.PROPERTY_TYPES;
generated.PRIVATE_TYPES;
generated.PATTERN_TYPES;
generated.PATTERNLIKE_TYPES;
generated.OBJECTMEMBER_TYPES;
generated.MODULESPECIFIER_TYPES;
generated.MODULEDECLARATION_TYPES;
generated.MISCELLANEOUS_TYPES;
generated.METHOD_TYPES;
generated.LVAL_TYPES;
generated.LOOP_TYPES;
generated.LITERAL_TYPES;
generated.JSX_TYPES;
generated.IMPORTOREXPORTDECLARATION_TYPES;
generated.IMMUTABLE_TYPES;
generated.FUNCTION_TYPES;
generated.FUNCTIONPARENT_TYPES;
generated.FOR_TYPES;
generated.FORXSTATEMENT_TYPES;
generated.FLOW_TYPES;
generated.FLOWTYPE_TYPES;
generated.FLOWPREDICATE_TYPES;
generated.FLOWDECLARATION_TYPES;
generated.FLOWBASEANNOTATION_TYPES;
generated.EXPRESSION_TYPES;
generated.EXPRESSIONWRAPPER_TYPES;
generated.EXPORTDECLARATION_TYPES;
generated.ENUMMEMBER_TYPES;
generated.ENUMBODY_TYPES;
generated.DECLARATION_TYPES;
generated.CONDITIONAL_TYPES;
generated.COMPLETIONSTATEMENT_TYPES;
generated.CLASS_TYPES;
generated.BLOCK_TYPES;
generated.BLOCKPARENT_TYPES;
generated.BINARY_TYPES;
generated.ACCESSOR_TYPES;

var toBlock_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toBlock;


function toBlock(node, parent) {
  if ((0, generated$3.isBlockStatement)(node)) {
    return node;
  }
  let blockNodes = [];
  if ((0, generated$3.isEmptyStatement)(node)) {
    blockNodes = [];
  } else {
    if (!(0, generated$3.isStatement)(node)) {
      if ((0, generated$3.isFunction)(parent)) {
        node = (0, generated$2.returnStatement)(node);
      } else {
        node = (0, generated$2.expressionStatement)(node);
      }
    }
    blockNodes = [node];
  }
  return (0, generated$2.blockStatement)(blockNodes);
}


});

unwrapExports(toBlock_1);

var ensureBlock_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureBlock;

function ensureBlock(node, key = "body") {
  const result = (0, toBlock_1.default)(node[key], node);
  node[key] = result;
  return result;
}


});

unwrapExports(ensureBlock_1);

var toIdentifier_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toIdentifier;


function toIdentifier(input) {
  input = input + "";
  let name = "";
  for (const c of input) {
    name += (0, lib$2.isIdentifierChar)(c.codePointAt(0)) ? c : "-";
  }
  name = name.replace(/^[-0-9]+/, "");
  name = name.replace(/[-\s]+(.)?/g, function (match, c) {
    return c ? c.toUpperCase() : "";
  });
  if (!(0, isValidIdentifier_1.default)(name)) {
    name = `_${name}`;
  }
  return name || "_";
}


});

unwrapExports(toIdentifier_1);

var toBindingIdentifierName_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toBindingIdentifierName;

function toBindingIdentifierName(name) {
  name = (0, toIdentifier_1.default)(name);
  if (name === "eval" || name === "arguments") name = "_" + name;
  return name;
}


});

unwrapExports(toBindingIdentifierName_1);

var toComputedKey_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toComputedKey;


function toComputedKey(node, key = node.key || node.property) {
  if (!node.computed && (0, generated$3.isIdentifier)(key)) key = (0, generated$2.stringLiteral)(key.name);
  return key;
}


});

unwrapExports(toComputedKey_1);

var toExpression_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

exports.default = toExpression;
function toExpression(node) {
  if ((0, generated$3.isExpressionStatement)(node)) {
    node = node.expression;
  }
  if ((0, generated$3.isExpression)(node)) {
    return node;
  }
  if ((0, generated$3.isClass)(node)) {
    node.type = "ClassExpression";
  } else if ((0, generated$3.isFunction)(node)) {
    node.type = "FunctionExpression";
  }
  if (!(0, generated$3.isExpression)(node)) {
    throw new Error(`cannot turn ${node.type} to an expression`);
  }
  return node;
}


});

unwrapExports(toExpression_1);

var traverseFast_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = traverseFast;

function traverseFast(node, enter, opts) {
  if (!node) return;
  const keys = definitions.VISITOR_KEYS[node.type];
  if (!keys) return;
  opts = opts || {};
  enter(node, opts);
  for (const key of keys) {
    const subNode = node[key];
    if (Array.isArray(subNode)) {
      for (const node of subNode) {
        traverseFast(node, enter, opts);
      }
    } else {
      traverseFast(subNode, enter, opts);
    }
  }
}


});

unwrapExports(traverseFast_1);

var removeProperties_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeProperties;

const CLEAR_KEYS = ["tokens", "start", "end", "loc", "raw", "rawValue"];
const CLEAR_KEYS_PLUS_COMMENTS = [...constants$1.COMMENT_KEYS, "comments", ...CLEAR_KEYS];
function removeProperties(node, opts = {}) {
  const map = opts.preserveComments ? CLEAR_KEYS : CLEAR_KEYS_PLUS_COMMENTS;
  for (const key of map) {
    if (node[key] != null) node[key] = undefined;
  }
  for (const key of Object.keys(node)) {
    if (key[0] === "_" && node[key] != null) node[key] = undefined;
  }
  const symbols = Object.getOwnPropertySymbols(node);
  for (const sym of symbols) {
    node[sym] = null;
  }
}


});

unwrapExports(removeProperties_1);

var removePropertiesDeep_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removePropertiesDeep;


function removePropertiesDeep(tree, opts) {
  (0, traverseFast_1.default)(tree, removeProperties_1.default, opts);
  return tree;
}


});

unwrapExports(removePropertiesDeep_1);

var toKeyAlias_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toKeyAlias;



function toKeyAlias(node, key = node.key) {
  let alias;
  if (node.kind === "method") {
    return toKeyAlias.increment() + "";
  } else if ((0, generated$3.isIdentifier)(key)) {
    alias = key.name;
  } else if ((0, generated$3.isStringLiteral)(key)) {
    alias = JSON.stringify(key.value);
  } else {
    alias = JSON.stringify((0, removePropertiesDeep_1.default)((0, cloneNode_1.default)(key)));
  }
  if (node.computed) {
    alias = `[${alias}]`;
  }
  if (node.static) {
    alias = `static:${alias}`;
  }
  return alias;
}
toKeyAlias.uid = 0;
toKeyAlias.increment = function () {
  if (toKeyAlias.uid >= Number.MAX_SAFE_INTEGER) {
    return toKeyAlias.uid = 0;
  } else {
    return toKeyAlias.uid++;
  }
};


});

unwrapExports(toKeyAlias_1);

var toStatement_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;


exports.default = toStatement;
function toStatement(node, ignore) {
  if ((0, generated$3.isStatement)(node)) {
    return node;
  }
  let mustHaveId = false;
  let newType;
  if ((0, generated$3.isClass)(node)) {
    mustHaveId = true;
    newType = "ClassDeclaration";
  } else if ((0, generated$3.isFunction)(node)) {
    mustHaveId = true;
    newType = "FunctionDeclaration";
  } else if ((0, generated$3.isAssignmentExpression)(node)) {
    return (0, generated$2.expressionStatement)(node);
  }
  if (mustHaveId && !node.id) {
    newType = false;
  }
  if (!newType) {
    if (ignore) {
      return false;
    } else {
      throw new Error(`cannot turn ${node.type} to a statement`);
    }
  }
  node.type = newType;
  return node;
}


});

unwrapExports(toStatement_1);

var valueToNode_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;


exports.default = valueToNode;
const objectToString = Function.call.bind(Object.prototype.toString);
function isRegExp(value) {
  return objectToString(value) === "[object RegExp]";
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null || Object.prototype.toString.call(value) !== "[object Object]") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === null || Object.getPrototypeOf(proto) === null;
}
function valueToNode(value) {
  if (value === undefined) {
    return (0, generated$2.identifier)("undefined");
  }
  if (value === true || value === false) {
    return (0, generated$2.booleanLiteral)(value);
  }
  if (value === null) {
    return (0, generated$2.nullLiteral)();
  }
  if (typeof value === "string") {
    return (0, generated$2.stringLiteral)(value);
  }
  if (typeof value === "number") {
    let result;
    if (Number.isFinite(value)) {
      result = (0, generated$2.numericLiteral)(Math.abs(value));
    } else {
      let numerator;
      if (Number.isNaN(value)) {
        numerator = (0, generated$2.numericLiteral)(0);
      } else {
        numerator = (0, generated$2.numericLiteral)(1);
      }
      result = (0, generated$2.binaryExpression)("/", numerator, (0, generated$2.numericLiteral)(0));
    }
    if (value < 0 || Object.is(value, -0)) {
      result = (0, generated$2.unaryExpression)("-", result);
    }
    return result;
  }
  if (isRegExp(value)) {
    const pattern = value.source;
    const flags = value.toString().match(/\/([a-z]+|)$/)[1];
    return (0, generated$2.regExpLiteral)(pattern, flags);
  }
  if (Array.isArray(value)) {
    return (0, generated$2.arrayExpression)(value.map(valueToNode));
  }
  if (isPlainObject(value)) {
    const props = [];
    for (const key of Object.keys(value)) {
      let nodeKey;
      if ((0, isValidIdentifier_1.default)(key)) {
        nodeKey = (0, generated$2.identifier)(key);
      } else {
        nodeKey = (0, generated$2.stringLiteral)(key);
      }
      props.push((0, generated$2.objectProperty)(nodeKey, valueToNode(value[key])));
    }
    return (0, generated$2.objectExpression)(props);
  }
  throw new Error("don't know how to turn this value into a node");
}


});

unwrapExports(valueToNode_1);

var appendToMemberExpression_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = appendToMemberExpression;

function appendToMemberExpression(member, append, computed = false) {
  member.object = (0, generated$2.memberExpression)(member.object, member.property, member.computed);
  member.property = append;
  member.computed = !!computed;
  return member;
}


});

unwrapExports(appendToMemberExpression_1);

var inherits_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inherits;


function inherits(child, parent) {
  if (!child || !parent) return child;
  for (const key of constants$1.INHERIT_KEYS.optional) {
    if (child[key] == null) {
      child[key] = parent[key];
    }
  }
  for (const key of Object.keys(parent)) {
    if (key[0] === "_" && key !== "__clone") {
      child[key] = parent[key];
    }
  }
  for (const key of constants$1.INHERIT_KEYS.force) {
    child[key] = parent[key];
  }
  (0, inheritsComments_1.default)(child, parent);
  return child;
}


});

unwrapExports(inherits_1);

var prependToMemberExpression_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prependToMemberExpression;


function prependToMemberExpression(member, prepend) {
  if ((0, lib.isSuper)(member.object)) {
    throw new Error("Cannot prepend node to super property access (`super.foo`).");
  }
  member.object = (0, generated$2.memberExpression)(prepend, member.object);
  return member;
}


});

unwrapExports(prependToMemberExpression_1);

var getBindingIdentifiers_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getBindingIdentifiers;

function getBindingIdentifiers(node, duplicates, outerOnly, newBindingsOnly) {
  const search = [].concat(node);
  const ids = Object.create(null);
  while (search.length) {
    const id = search.shift();
    if (!id) continue;
    if (newBindingsOnly && ((0, generated$3.isAssignmentExpression)(id) || (0, generated$3.isUnaryExpression)(id))) {
      continue;
    }
    const keys = getBindingIdentifiers.keys[id.type];
    if ((0, generated$3.isIdentifier)(id)) {
      if (duplicates) {
        const _ids = ids[id.name] = ids[id.name] || [];
        _ids.push(id);
      } else {
        ids[id.name] = id;
      }
      continue;
    }
    if ((0, generated$3.isExportDeclaration)(id) && !(0, generated$3.isExportAllDeclaration)(id)) {
      if ((0, generated$3.isDeclaration)(id.declaration)) {
        search.push(id.declaration);
      }
      continue;
    }
    if (outerOnly) {
      if ((0, generated$3.isFunctionDeclaration)(id)) {
        search.push(id.id);
        continue;
      }
      if ((0, generated$3.isFunctionExpression)(id)) {
        continue;
      }
    }
    if (keys) {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const nodes = id[key];
        if (nodes) {
          Array.isArray(nodes) ? search.push(...nodes) : search.push(nodes);
        }
      }
    }
  }
  return ids;
}
getBindingIdentifiers.keys = {
  DeclareClass: ["id"],
  DeclareFunction: ["id"],
  DeclareModule: ["id"],
  DeclareVariable: ["id"],
  DeclareInterface: ["id"],
  DeclareTypeAlias: ["id"],
  DeclareOpaqueType: ["id"],
  InterfaceDeclaration: ["id"],
  TypeAlias: ["id"],
  OpaqueType: ["id"],
  CatchClause: ["param"],
  LabeledStatement: ["label"],
  UnaryExpression: ["argument"],
  AssignmentExpression: ["left"],
  ImportSpecifier: ["local"],
  ImportNamespaceSpecifier: ["local"],
  ImportDefaultSpecifier: ["local"],
  ImportDeclaration: ["specifiers"],
  ExportSpecifier: ["exported"],
  ExportNamespaceSpecifier: ["exported"],
  ExportDefaultSpecifier: ["exported"],
  FunctionDeclaration: ["id", "params"],
  FunctionExpression: ["id", "params"],
  ArrowFunctionExpression: ["params"],
  ObjectMethod: ["params"],
  ClassMethod: ["params"],
  ClassPrivateMethod: ["params"],
  ForInStatement: ["left"],
  ForOfStatement: ["left"],
  ClassDeclaration: ["id"],
  ClassExpression: ["id"],
  RestElement: ["argument"],
  UpdateExpression: ["argument"],
  ObjectProperty: ["value"],
  AssignmentPattern: ["left"],
  ArrayPattern: ["elements"],
  ObjectPattern: ["properties"],
  VariableDeclaration: ["declarations"],
  VariableDeclarator: ["id"]
};


});

unwrapExports(getBindingIdentifiers_1);

var getOuterBindingIdentifiers_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

exports.default = getOuterBindingIdentifiers;
function getOuterBindingIdentifiers(node, duplicates) {
  return (0, getBindingIdentifiers_1.default)(node, duplicates, true);
}


});

unwrapExports(getOuterBindingIdentifiers_1);

var traverse_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = traverse;

function traverse(node, handlers, state) {
  if (typeof handlers === "function") {
    handlers = {
      enter: handlers
    };
  }
  const {
    enter,
    exit
  } = handlers;
  traverseSimpleImpl(node, enter, exit, state, []);
}
function traverseSimpleImpl(node, enter, exit, state, ancestors) {
  const keys = definitions.VISITOR_KEYS[node.type];
  if (!keys) return;
  if (enter) enter(node, ancestors, state);
  for (const key of keys) {
    const subNode = node[key];
    if (Array.isArray(subNode)) {
      for (let i = 0; i < subNode.length; i++) {
        const child = subNode[i];
        if (!child) continue;
        ancestors.push({
          node,
          key,
          index: i
        });
        traverseSimpleImpl(child, enter, exit, state, ancestors);
        ancestors.pop();
      }
    } else if (subNode) {
      ancestors.push({
        node,
        key
      });
      traverseSimpleImpl(subNode, enter, exit, state, ancestors);
      ancestors.pop();
    }
  }
  if (exit) exit(node, ancestors, state);
}


});

unwrapExports(traverse_1);

var isBinding_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBinding;

function isBinding(node, parent, grandparent) {
  if (grandparent && node.type === "Identifier" && parent.type === "ObjectProperty" && grandparent.type === "ObjectExpression") {
    return false;
  }
  const keys = getBindingIdentifiers_1.default.keys[parent.type];
  if (keys) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const val = parent[key];
      if (Array.isArray(val)) {
        if (val.indexOf(node) >= 0) return true;
      } else {
        if (val === node) return true;
      }
    }
  }
  return false;
}


});

unwrapExports(isBinding_1);

var isLet_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isLet;


function isLet(node) {
  return (0, generated$3.isVariableDeclaration)(node) && (node.kind !== "var" || node[constants$1.BLOCK_SCOPED_SYMBOL]);
}


});

unwrapExports(isLet_1);

var isBlockScoped_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBlockScoped;


function isBlockScoped(node) {
  return (0, generated$3.isFunctionDeclaration)(node) || (0, generated$3.isClassDeclaration)(node) || (0, isLet_1.default)(node);
}


});

unwrapExports(isBlockScoped_1);

var isImmutable_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isImmutable;


function isImmutable(node) {
  if ((0, isType_1.default)(node.type, "Immutable")) return true;
  if ((0, generated$3.isIdentifier)(node)) {
    if (node.name === "undefined") {
      return true;
    } else {
      return false;
    }
  }
  return false;
}


});

unwrapExports(isImmutable_1);

var isNodesEquivalent_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNodesEquivalent;

function isNodesEquivalent(a, b) {
  if (typeof a !== "object" || typeof b !== "object" || a == null || b == null) {
    return a === b;
  }
  if (a.type !== b.type) {
    return false;
  }
  const fields = Object.keys(definitions.NODE_FIELDS[a.type] || a.type);
  const visitorKeys = definitions.VISITOR_KEYS[a.type];
  for (const field of fields) {
    const val_a = a[field];
    const val_b = b[field];
    if (typeof val_a !== typeof val_b) {
      return false;
    }
    if (val_a == null && val_b == null) {
      continue;
    } else if (val_a == null || val_b == null) {
      return false;
    }
    if (Array.isArray(val_a)) {
      if (!Array.isArray(val_b)) {
        return false;
      }
      if (val_a.length !== val_b.length) {
        return false;
      }
      for (let i = 0; i < val_a.length; i++) {
        if (!isNodesEquivalent(val_a[i], val_b[i])) {
          return false;
        }
      }
      continue;
    }
    if (typeof val_a === "object" && !(visitorKeys != null && visitorKeys.includes(field))) {
      for (const key of Object.keys(val_a)) {
        if (val_a[key] !== val_b[key]) {
          return false;
        }
      }
      continue;
    }
    if (!isNodesEquivalent(val_a, val_b)) {
      return false;
    }
  }
  return true;
}


});

unwrapExports(isNodesEquivalent_1);

var isReferenced_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isReferenced;
function isReferenced(node, parent, grandparent) {
  switch (parent.type) {
    case "MemberExpression":
    case "OptionalMemberExpression":
      if (parent.property === node) {
        return !!parent.computed;
      }
      return parent.object === node;
    case "JSXMemberExpression":
      return parent.object === node;
    case "VariableDeclarator":
      return parent.init === node;
    case "ArrowFunctionExpression":
      return parent.body === node;
    case "PrivateName":
      return false;
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "ObjectMethod":
      if (parent.key === node) {
        return !!parent.computed;
      }
      return false;
    case "ObjectProperty":
      if (parent.key === node) {
        return !!parent.computed;
      }
      return !grandparent || grandparent.type !== "ObjectPattern";
    case "ClassProperty":
    case "ClassAccessorProperty":
      if (parent.key === node) {
        return !!parent.computed;
      }
      return true;
    case "ClassPrivateProperty":
      return parent.key !== node;
    case "ClassDeclaration":
    case "ClassExpression":
      return parent.superClass === node;
    case "AssignmentExpression":
      return parent.right === node;
    case "AssignmentPattern":
      return parent.right === node;
    case "LabeledStatement":
      return false;
    case "CatchClause":
      return false;
    case "RestElement":
      return false;
    case "BreakStatement":
    case "ContinueStatement":
      return false;
    case "FunctionDeclaration":
    case "FunctionExpression":
      return false;
    case "ExportNamespaceSpecifier":
    case "ExportDefaultSpecifier":
      return false;
    case "ExportSpecifier":
      if (grandparent != null && grandparent.source) {
        return false;
      }
      return parent.local === node;
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
      return false;
    case "ImportAttribute":
      return false;
    case "JSXAttribute":
      return false;
    case "ObjectPattern":
    case "ArrayPattern":
      return false;
    case "MetaProperty":
      return false;
    case "ObjectTypeProperty":
      return parent.key !== node;
    case "TSEnumMember":
      return parent.id !== node;
    case "TSPropertySignature":
      if (parent.key === node) {
        return !!parent.computed;
      }
      return true;
  }
  return true;
}


});

unwrapExports(isReferenced_1);

var isScope_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isScope;

function isScope(node, parent) {
  if ((0, generated$3.isBlockStatement)(node) && ((0, generated$3.isFunction)(parent) || (0, generated$3.isCatchClause)(parent))) {
    return false;
  }
  if ((0, generated$3.isPattern)(node) && ((0, generated$3.isFunction)(parent) || (0, generated$3.isCatchClause)(parent))) {
    return true;
  }
  return (0, generated$3.isScopable)(node);
}


});

unwrapExports(isScope_1);

var isSpecifierDefault_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isSpecifierDefault;

function isSpecifierDefault(specifier) {
  return (0, generated$3.isImportDefaultSpecifier)(specifier) || (0, generated$3.isIdentifier)(specifier.imported || specifier.exported, {
    name: "default"
  });
}


});

unwrapExports(isSpecifierDefault_1);

var isValidES3Identifier_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isValidES3Identifier;

const RESERVED_WORDS_ES3_ONLY = new Set(["abstract", "boolean", "byte", "char", "double", "enum", "final", "float", "goto", "implements", "int", "interface", "long", "native", "package", "private", "protected", "public", "short", "static", "synchronized", "throws", "transient", "volatile"]);
function isValidES3Identifier(name) {
  return (0, isValidIdentifier_1.default)(name) && !RESERVED_WORDS_ES3_ONLY.has(name);
}


});

unwrapExports(isValidES3Identifier_1);

var isVar_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isVar;


function isVar(node) {
  return (0, generated$3.isVariableDeclaration)(node, {
    kind: "var"
  }) && !node[constants$1.BLOCK_SCOPED_SYMBOL];
}


});

unwrapExports(isVar_1);

var gatherSequenceExpressions_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = gatherSequenceExpressions;
function gatherSequenceExpressions(nodes, scope, declars) {
  const exprs = [];
  let ensureLastUndefined = true;
  for (const node of nodes) {
    if (!(0, generated$3.isEmptyStatement)(node)) {
      ensureLastUndefined = false;
    }
    if ((0, generated$3.isExpression)(node)) {
      exprs.push(node);
    } else if ((0, generated$3.isExpressionStatement)(node)) {
      exprs.push(node.expression);
    } else if ((0, generated$3.isVariableDeclaration)(node)) {
      if (node.kind !== "var") return;
      for (const declar of node.declarations) {
        const bindings = (0, getBindingIdentifiers_1.default)(declar);
        for (const key of Object.keys(bindings)) {
          declars.push({
            kind: node.kind,
            id: (0, cloneNode_1.default)(bindings[key])
          });
        }
        if (declar.init) {
          exprs.push((0, generated$2.assignmentExpression)("=", declar.id, declar.init));
        }
      }
      ensureLastUndefined = true;
    } else if ((0, generated$3.isIfStatement)(node)) {
      const consequent = node.consequent ? gatherSequenceExpressions([node.consequent], scope, declars) : scope.buildUndefinedNode();
      const alternate = node.alternate ? gatherSequenceExpressions([node.alternate], scope, declars) : scope.buildUndefinedNode();
      if (!consequent || !alternate) return;
      exprs.push((0, generated$2.conditionalExpression)(node.test, consequent, alternate));
    } else if ((0, generated$3.isBlockStatement)(node)) {
      const body = gatherSequenceExpressions(node.body, scope, declars);
      if (!body) return;
      exprs.push(body);
    } else if ((0, generated$3.isEmptyStatement)(node)) {
      if (nodes.indexOf(node) === 0) {
        ensureLastUndefined = true;
      }
    } else {
      return;
    }
  }
  if (ensureLastUndefined) {
    exprs.push(scope.buildUndefinedNode());
  }
  if (exprs.length === 1) {
    return exprs[0];
  } else {
    return (0, generated$2.sequenceExpression)(exprs);
  }
}


});

unwrapExports(gatherSequenceExpressions_1);

var toSequenceExpression_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toSequenceExpression;
function toSequenceExpression(nodes, scope) {
  if (!(nodes != null && nodes.length)) return;
  const declars = [];
  const result = (0, gatherSequenceExpressions_1.default)(nodes, scope, declars);
  if (!result) return;
  for (const declar of declars) {
    scope.push(declar);
  }
  return result;
}


});

unwrapExports(toSequenceExpression_1);

var lib = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  react: true,
  assertNode: true,
  createTypeAnnotationBasedOnTypeof: true,
  createUnionTypeAnnotation: true,
  createFlowUnionType: true,
  createTSUnionType: true,
  cloneNode: true,
  clone: true,
  cloneDeep: true,
  cloneDeepWithoutLoc: true,
  cloneWithoutLoc: true,
  addComment: true,
  addComments: true,
  inheritInnerComments: true,
  inheritLeadingComments: true,
  inheritsComments: true,
  inheritTrailingComments: true,
  removeComments: true,
  ensureBlock: true,
  toBindingIdentifierName: true,
  toBlock: true,
  toComputedKey: true,
  toExpression: true,
  toIdentifier: true,
  toKeyAlias: true,
  toStatement: true,
  valueToNode: true,
  appendToMemberExpression: true,
  inherits: true,
  prependToMemberExpression: true,
  removeProperties: true,
  removePropertiesDeep: true,
  removeTypeDuplicates: true,
  getBindingIdentifiers: true,
  getOuterBindingIdentifiers: true,
  traverse: true,
  traverseFast: true,
  shallowEqual: true,
  is: true,
  isBinding: true,
  isBlockScoped: true,
  isImmutable: true,
  isLet: true,
  isNode: true,
  isNodesEquivalent: true,
  isPlaceholderType: true,
  isReferenced: true,
  isScope: true,
  isSpecifierDefault: true,
  isType: true,
  isValidES3Identifier: true,
  isValidIdentifier: true,
  isVar: true,
  matchesPattern: true,
  validate: true,
  buildMatchMemberExpression: true,
  __internal__deprecationWarning: true
};
Object.defineProperty(exports, "__internal__deprecationWarning", {
  enumerable: true,
  get: function () {
    return deprecationWarning_1.default;
  }
});
Object.defineProperty(exports, "addComment", {
  enumerable: true,
  get: function () {
    return addComment_1.default;
  }
});
Object.defineProperty(exports, "addComments", {
  enumerable: true,
  get: function () {
    return addComments_1.default;
  }
});
Object.defineProperty(exports, "appendToMemberExpression", {
  enumerable: true,
  get: function () {
    return appendToMemberExpression_1.default;
  }
});
Object.defineProperty(exports, "assertNode", {
  enumerable: true,
  get: function () {
    return assertNode_1.default;
  }
});
Object.defineProperty(exports, "buildMatchMemberExpression", {
  enumerable: true,
  get: function () {
    return buildMatchMemberExpression_1.default;
  }
});
Object.defineProperty(exports, "clone", {
  enumerable: true,
  get: function () {
    return clone_1.default;
  }
});
Object.defineProperty(exports, "cloneDeep", {
  enumerable: true,
  get: function () {
    return cloneDeep_1.default;
  }
});
Object.defineProperty(exports, "cloneDeepWithoutLoc", {
  enumerable: true,
  get: function () {
    return cloneDeepWithoutLoc_1.default;
  }
});
Object.defineProperty(exports, "cloneNode", {
  enumerable: true,
  get: function () {
    return cloneNode_1.default;
  }
});
Object.defineProperty(exports, "cloneWithoutLoc", {
  enumerable: true,
  get: function () {
    return cloneWithoutLoc_1.default;
  }
});
Object.defineProperty(exports, "createFlowUnionType", {
  enumerable: true,
  get: function () {
    return createFlowUnionType_1.default;
  }
});
Object.defineProperty(exports, "createTSUnionType", {
  enumerable: true,
  get: function () {
    return createTSUnionType_1.default;
  }
});
Object.defineProperty(exports, "createTypeAnnotationBasedOnTypeof", {
  enumerable: true,
  get: function () {
    return createTypeAnnotationBasedOnTypeof_1.default;
  }
});
Object.defineProperty(exports, "createUnionTypeAnnotation", {
  enumerable: true,
  get: function () {
    return createFlowUnionType_1.default;
  }
});
Object.defineProperty(exports, "ensureBlock", {
  enumerable: true,
  get: function () {
    return ensureBlock_1.default;
  }
});
Object.defineProperty(exports, "getBindingIdentifiers", {
  enumerable: true,
  get: function () {
    return getBindingIdentifiers_1.default;
  }
});
Object.defineProperty(exports, "getOuterBindingIdentifiers", {
  enumerable: true,
  get: function () {
    return getOuterBindingIdentifiers_1.default;
  }
});
Object.defineProperty(exports, "inheritInnerComments", {
  enumerable: true,
  get: function () {
    return inheritInnerComments_1.default;
  }
});
Object.defineProperty(exports, "inheritLeadingComments", {
  enumerable: true,
  get: function () {
    return inheritLeadingComments_1.default;
  }
});
Object.defineProperty(exports, "inheritTrailingComments", {
  enumerable: true,
  get: function () {
    return inheritTrailingComments_1.default;
  }
});
Object.defineProperty(exports, "inherits", {
  enumerable: true,
  get: function () {
    return inherits_1.default;
  }
});
Object.defineProperty(exports, "inheritsComments", {
  enumerable: true,
  get: function () {
    return inheritsComments_1.default;
  }
});
Object.defineProperty(exports, "is", {
  enumerable: true,
  get: function () {
    return is_1.default;
  }
});
Object.defineProperty(exports, "isBinding", {
  enumerable: true,
  get: function () {
    return isBinding_1.default;
  }
});
Object.defineProperty(exports, "isBlockScoped", {
  enumerable: true,
  get: function () {
    return isBlockScoped_1.default;
  }
});
Object.defineProperty(exports, "isImmutable", {
  enumerable: true,
  get: function () {
    return isImmutable_1.default;
  }
});
Object.defineProperty(exports, "isLet", {
  enumerable: true,
  get: function () {
    return isLet_1.default;
  }
});
Object.defineProperty(exports, "isNode", {
  enumerable: true,
  get: function () {
    return isNode_1.default;
  }
});
Object.defineProperty(exports, "isNodesEquivalent", {
  enumerable: true,
  get: function () {
    return isNodesEquivalent_1.default;
  }
});
Object.defineProperty(exports, "isPlaceholderType", {
  enumerable: true,
  get: function () {
    return isPlaceholderType_1.default;
  }
});
Object.defineProperty(exports, "isReferenced", {
  enumerable: true,
  get: function () {
    return isReferenced_1.default;
  }
});
Object.defineProperty(exports, "isScope", {
  enumerable: true,
  get: function () {
    return isScope_1.default;
  }
});
Object.defineProperty(exports, "isSpecifierDefault", {
  enumerable: true,
  get: function () {
    return isSpecifierDefault_1.default;
  }
});
Object.defineProperty(exports, "isType", {
  enumerable: true,
  get: function () {
    return isType_1.default;
  }
});
Object.defineProperty(exports, "isValidES3Identifier", {
  enumerable: true,
  get: function () {
    return isValidES3Identifier_1.default;
  }
});
Object.defineProperty(exports, "isValidIdentifier", {
  enumerable: true,
  get: function () {
    return isValidIdentifier_1.default;
  }
});
Object.defineProperty(exports, "isVar", {
  enumerable: true,
  get: function () {
    return isVar_1.default;
  }
});
Object.defineProperty(exports, "matchesPattern", {
  enumerable: true,
  get: function () {
    return matchesPattern_1.default;
  }
});
Object.defineProperty(exports, "prependToMemberExpression", {
  enumerable: true,
  get: function () {
    return prependToMemberExpression_1.default;
  }
});
exports.react = void 0;
Object.defineProperty(exports, "removeComments", {
  enumerable: true,
  get: function () {
    return removeComments_1.default;
  }
});
Object.defineProperty(exports, "removeProperties", {
  enumerable: true,
  get: function () {
    return removeProperties_1.default;
  }
});
Object.defineProperty(exports, "removePropertiesDeep", {
  enumerable: true,
  get: function () {
    return removePropertiesDeep_1.default;
  }
});
Object.defineProperty(exports, "removeTypeDuplicates", {
  enumerable: true,
  get: function () {
    return removeTypeDuplicates_1$1.default;
  }
});
Object.defineProperty(exports, "shallowEqual", {
  enumerable: true,
  get: function () {
    return shallowEqual_1.default;
  }
});
Object.defineProperty(exports, "toBindingIdentifierName", {
  enumerable: true,
  get: function () {
    return toBindingIdentifierName_1.default;
  }
});
Object.defineProperty(exports, "toBlock", {
  enumerable: true,
  get: function () {
    return toBlock_1.default;
  }
});
Object.defineProperty(exports, "toComputedKey", {
  enumerable: true,
  get: function () {
    return toComputedKey_1.default;
  }
});
Object.defineProperty(exports, "toExpression", {
  enumerable: true,
  get: function () {
    return toExpression_1.default;
  }
});
Object.defineProperty(exports, "toIdentifier", {
  enumerable: true,
  get: function () {
    return toIdentifier_1.default;
  }
});
Object.defineProperty(exports, "toKeyAlias", {
  enumerable: true,
  get: function () {
    return toKeyAlias_1.default;
  }
});
Object.defineProperty(exports, "toStatement", {
  enumerable: true,
  get: function () {
    return toStatement_1.default;
  }
});
Object.defineProperty(exports, "traverse", {
  enumerable: true,
  get: function () {
    return traverse_1.default;
  }
});
Object.defineProperty(exports, "traverseFast", {
  enumerable: true,
  get: function () {
    return traverseFast_1.default;
  }
});
Object.defineProperty(exports, "validate", {
  enumerable: true,
  get: function () {
    return validate_1.default;
  }
});
Object.defineProperty(exports, "valueToNode", {
  enumerable: true,
  get: function () {
    return valueToNode_1.default;
  }
});





Object.keys(generated$1).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === generated$1[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return generated$1[key];
    }
  });
});




Object.keys(generated$2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === generated$2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return generated$2[key];
    }
  });
});

Object.keys(uppercase).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === uppercase[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return uppercase[key];
    }
  });
});

Object.keys(productions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === productions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return productions[key];
    }
  });
});













Object.keys(generated).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === generated[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return generated[key];
    }
  });
});

Object.keys(constants$1).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === constants$1[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return constants$1[key];
    }
  });
});










Object.keys(definitions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === definitions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return definitions[key];
    }
  });
});









Object.keys(traverse_1).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === traverse_1[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return traverse_1[key];
    }
  });
});





















Object.keys(generated$3).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === generated$3[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return generated$3[key];
    }
  });
});

exports.react = {
  isReactComponent: isReactComponent_1.default,
  isCompatTag: isCompatTag_1.default,
  buildChildren: buildChildren_1.default
};
{
  exports.toSequenceExpression = toSequenceExpression_1.default;
}


});

unwrapExports(lib);
lib.react;
lib.toSequenceExpression;

// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
// Some of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// However, the vast majority of the codebase has diverged from UZIP.js to increase performance and reduce bundle size.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).

// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
// code length index map
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
// get base, reverse index map from extra bits
var freb = function (eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
    }
    // numbers here are at max 18 bits
    var r = new i32(b[30]);
    for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
            r[j] = ((j - b[i]) << 5) | i;
        }
    }
    return { b: b, r: r };
};
var _a = freb(fleb, 2), fl = _a.b, revfl = _a.r;
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b.b, revfd = _b.r;
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
    // reverse table algorithm from SO
    var x = ((i & 0xAAAA) >> 1) | ((i & 0x5555) << 1);
    x = ((x & 0xCCCC) >> 2) | ((x & 0x3333) << 2);
    x = ((x & 0xF0F0) >> 4) | ((x & 0x0F0F) << 4);
    rev[i] = (((x & 0xFF00) >> 8) | ((x & 0x00FF) << 8)) >> 1;
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap = (function (cd, mb, r) {
    var s = cd.length;
    // index
    var i = 0;
    // u16 "map": index -> # of codes with bit length = index
    var l = new u16(mb);
    // length of cd must be 288 (total # of codes)
    for (; i < s; ++i) {
        if (cd[i])
            ++l[cd[i] - 1];
    }
    // u16 "map": index -> minimum code for bit length = index
    var le = new u16(mb);
    for (i = 1; i < mb; ++i) {
        le[i] = (le[i - 1] + l[i - 1]) << 1;
    }
    var co;
    if (r) {
        // u16 "map": index -> number of actual bits, symbol for code
        co = new u16(1 << mb);
        // bits to remove for reverser
        var rvb = 15 - mb;
        for (i = 0; i < s; ++i) {
            // ignore 0 lengths
            if (cd[i]) {
                // num encoding both symbol and bits read
                var sv = (i << 4) | cd[i];
                // free bits
                var r_1 = mb - cd[i];
                // start value
                var v = le[cd[i] - 1]++ << r_1;
                // m is end value
                for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                    // every 16 bit value starting with the code yields the same result
                    co[rev[v] >> rvb] = sv;
                }
            }
        }
    }
    else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
            if (cd[i]) {
                co[i] = rev[le[cd[i] - 1]++] >> (15 - cd[i]);
            }
        }
    }
    return co;
});
// fixed length tree
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
    flt[i] = 8;
for (var i = 144; i < 256; ++i)
    flt[i] = 9;
for (var i = 256; i < 280; ++i)
    flt[i] = 7;
for (var i = 280; i < 288; ++i)
    flt[i] = 8;
// fixed distance tree
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
    fdt[i] = 5;
// fixed length map
var flm = /*#__PURE__*/ hMap(flt, 9, 0), flrm = /*#__PURE__*/ hMap(flt, 9, 1);
// fixed distance map
var fdm = /*#__PURE__*/ hMap(fdt, 5, 0), fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);
// find max of array
var max = function (a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
        if (a[i] > m)
            m = a[i];
    }
    return m;
};
// read d, starting at bit p and mask with m
var bits = function (d, p, m) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
};
// read d, starting at bit p continuing for at least 16 bits
var bits16 = function (d, p) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7));
};
// get end of byte
var shft = function (p) { return ((p + 7) / 8) | 0; };
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
    if (s == null || s < 0)
        s = 0;
    if (e == null || e > v.length)
        e = v.length;
    // can't use .constructor in case user-supplied
    return new u8(v.subarray(s, e));
};
// error codes
var ec = [
    'unexpected EOF',
    'invalid block type',
    'invalid length/literal',
    'invalid distance',
    'stream finished',
    'no stream handler',
    ,
    'no callback',
    'invalid UTF-8 data',
    'extra field too long',
    'date not in range 1980-2099',
    'filename too long',
    'stream finishing',
    'invalid zip data'
    // determined by unknown compression method
];
var err = function (ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
        Error.captureStackTrace(e, err);
    if (!nt)
        throw e;
    return e;
};
// expands raw DEFLATE data
var inflt = function (dat, st, buf, dict) {
    // source length       dict length
    var sl = dat.length, dl = dict ? dict.length : 0;
    if (!sl || st.f && !st.l)
        return buf || new u8(0);
    var noBuf = !buf;
    // have to estimate size
    var resize = noBuf || st.i != 2;
    // no state
    var noSt = st.i;
    // Assumes roughly 33% compression ratio average
    if (noBuf)
        buf = new u8(sl * 3);
    // ensure buffer can fit at least l elements
    var cbuf = function (l) {
        var bl = buf.length;
        // need to increase size to fit
        if (l > bl) {
            // Double or set to necessary, whichever is greater
            var nbuf = new u8(Math.max(bl * 2, l));
            nbuf.set(buf);
            buf = nbuf;
        }
    };
    //  last chunk         bitpos           bytes
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    // total bits
    var tbts = sl * 8;
    do {
        if (!lm) {
            // BFINAL - this is only 1 when last chunk is next
            final = bits(dat, pos, 1);
            // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
            var type = bits(dat, pos + 1, 3);
            pos += 3;
            if (!type) {
                // go to end of byte boundary
                var s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
                if (t > sl) {
                    if (noSt)
                        err(0);
                    break;
                }
                // ensure size
                if (resize)
                    cbuf(bt + l);
                // Copy over uncompressed data
                buf.set(dat.subarray(s, t), bt);
                // Get new bitpos, update byte count
                st.b = bt += l, st.p = pos = t * 8, st.f = final;
                continue;
            }
            else if (type == 1)
                lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
            else if (type == 2) {
                //  literal                            lengths
                var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
                var tl = hLit + bits(dat, pos + 5, 31) + 1;
                pos += 14;
                // length+distance tree
                var ldt = new u8(tl);
                // code length tree
                var clt = new u8(19);
                for (var i = 0; i < hcLen; ++i) {
                    // use index map to get real code
                    clt[clim[i]] = bits(dat, pos + i * 3, 7);
                }
                pos += hcLen * 3;
                // code lengths bits
                var clb = max(clt), clbmsk = (1 << clb) - 1;
                // code lengths map
                var clm = hMap(clt, clb, 1);
                for (var i = 0; i < tl;) {
                    var r = clm[bits(dat, pos, clbmsk)];
                    // bits read
                    pos += r & 15;
                    // symbol
                    var s = r >> 4;
                    // code length to copy
                    if (s < 16) {
                        ldt[i++] = s;
                    }
                    else {
                        //  copy   count
                        var c = 0, n = 0;
                        if (s == 16)
                            n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
                        else if (s == 17)
                            n = 3 + bits(dat, pos, 7), pos += 3;
                        else if (s == 18)
                            n = 11 + bits(dat, pos, 127), pos += 7;
                        while (n--)
                            ldt[i++] = c;
                    }
                }
                //    length tree                 distance tree
                var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
                // max length bits
                lbt = max(lt);
                // max dist bits
                dbt = max(dt);
                lm = hMap(lt, lbt, 1);
                dm = hMap(dt, dbt, 1);
            }
            else
                err(1);
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
        }
        // Make sure the buffer can hold this + the largest possible addition
        // Maximum chunk size (practically, theoretically infinite) is 2^17
        if (resize)
            cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (;; lpos = pos) {
            // bits read, code
            var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
            pos += c & 15;
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
            if (!c)
                err(2);
            if (sym < 256)
                buf[bt++] = sym;
            else if (sym == 256) {
                lpos = pos, lm = null;
                break;
            }
            else {
                var add = sym - 254;
                // no extra bits needed if less
                if (sym > 264) {
                    // index
                    var i = sym - 257, b = fleb[i];
                    add = bits(dat, pos, (1 << b) - 1) + fl[i];
                    pos += b;
                }
                // dist
                var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
                if (!d)
                    err(3);
                pos += d & 15;
                var dt = fd[dsym];
                if (dsym > 3) {
                    var b = fdeb[dsym];
                    dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
                }
                if (pos > tbts) {
                    if (noSt)
                        err(0);
                    break;
                }
                if (resize)
                    cbuf(bt + 131072);
                var end = bt + add;
                if (bt < dt) {
                    var shift = dl - dt, dend = Math.min(dt, end);
                    if (shift + bt < 0)
                        err(3);
                    for (; bt < dend; ++bt)
                        buf[bt] = dict[shift + bt];
                }
                for (; bt < end; ++bt)
                    buf[bt] = buf[bt - dt];
            }
        }
        st.l = lm, st.p = lpos, st.b = bt, st.f = final;
        if (lm)
            final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    // don't reallocate for streams or user buffers
    return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
// starting at p, write the minimum number of bits that can hold v to d
var wbits = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >> 8;
};
// starting at p, write the minimum number of bits (>8) that can hold v to d
var wbits16 = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >> 8;
    d[o + 2] |= v >> 16;
};
// creates code lengths from a frequency table
var hTree = function (d, mb) {
    // Need extra info to make a tree
    var t = [];
    for (var i = 0; i < d.length; ++i) {
        if (d[i])
            t.push({ s: i, f: d[i] });
    }
    var s = t.length;
    var t2 = t.slice();
    if (!s)
        return { t: et, l: 0 };
    if (s == 1) {
        var v = new u8(t[0].s + 1);
        v[t[0].s] = 1;
        return { t: v, l: 1 };
    }
    t.sort(function (a, b) { return a.f - b.f; });
    // after i2 reaches last ind, will be stopped
    // freq must be greater than largest possible number of symbols
    t.push({ s: -1, f: 25001 });
    var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
    t[0] = { s: -1, f: l.f + r.f, l: l, r: r };
    // efficient algorithm from UZIP.js
    // i0 is lookbehind, i2 is lookahead - after processing two low-freq
    // symbols that combined have high freq, will start processing i2 (high-freq,
    // non-composite) symbols instead
    // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
    while (i1 != s - 1) {
        l = t[t[i0].f < t[i2].f ? i0++ : i2++];
        r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
        t[i1++] = { s: -1, f: l.f + r.f, l: l, r: r };
    }
    var maxSym = t2[0].s;
    for (var i = 1; i < s; ++i) {
        if (t2[i].s > maxSym)
            maxSym = t2[i].s;
    }
    // code lengths
    var tr = new u16(maxSym + 1);
    // max bits in tree
    var mbt = ln(t[i1 - 1], tr, 0);
    if (mbt > mb) {
        // more algorithms from UZIP.js
        // TODO: find out how this code works (debt)
        //  ind    debt
        var i = 0, dt = 0;
        //    left            cost
        var lft = mbt - mb, cst = 1 << lft;
        t2.sort(function (a, b) { return tr[b.s] - tr[a.s] || a.f - b.f; });
        for (; i < s; ++i) {
            var i2_1 = t2[i].s;
            if (tr[i2_1] > mb) {
                dt += cst - (1 << (mbt - tr[i2_1]));
                tr[i2_1] = mb;
            }
            else
                break;
        }
        dt >>= lft;
        while (dt > 0) {
            var i2_2 = t2[i].s;
            if (tr[i2_2] < mb)
                dt -= 1 << (mb - tr[i2_2]++ - 1);
            else
                ++i;
        }
        for (; i >= 0 && dt; --i) {
            var i2_3 = t2[i].s;
            if (tr[i2_3] == mb) {
                --tr[i2_3];
                ++dt;
            }
        }
        mbt = mb;
    }
    return { t: new u8(tr), l: mbt };
};
// get the max length and assign length codes
var ln = function (n, l, d) {
    return n.s == -1
        ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1))
        : (l[n.s] = d);
};
// length codes generation
var lc = function (c) {
    var s = c.length;
    // Note that the semicolon was intentional
    while (s && !c[--s])
        ;
    var cl = new u16(++s);
    //  ind      num         streak
    var cli = 0, cln = c[0], cls = 1;
    var w = function (v) { cl[cli++] = v; };
    for (var i = 1; i <= s; ++i) {
        if (c[i] == cln && i != s)
            ++cls;
        else {
            if (!cln && cls > 2) {
                for (; cls > 138; cls -= 138)
                    w(32754);
                if (cls > 2) {
                    w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305);
                    cls = 0;
                }
            }
            else if (cls > 3) {
                w(cln), --cls;
                for (; cls > 6; cls -= 6)
                    w(8304);
                if (cls > 2)
                    w(((cls - 3) << 5) | 8208), cls = 0;
            }
            while (cls--)
                w(cln);
            cls = 1;
            cln = c[i];
        }
    }
    return { c: cl.subarray(0, cli), n: s };
};
// calculate the length of output from tree, code lengths
var clen = function (cf, cl) {
    var l = 0;
    for (var i = 0; i < cl.length; ++i)
        l += cf[i] * cl[i];
    return l;
};
// writes a fixed block
// returns the new bit pos
var wfblk = function (out, pos, dat) {
    // no need to write 00 as type: TypedArray defaults to 0
    var s = dat.length;
    var o = shft(pos + 2);
    out[o] = s & 255;
    out[o + 1] = s >> 8;
    out[o + 2] = out[o] ^ 255;
    out[o + 3] = out[o + 1] ^ 255;
    for (var i = 0; i < s; ++i)
        out[o + i + 4] = dat[i];
    return (o + 4 + s) * 8;
};
// writes a block
var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
    wbits(out, p++, final);
    ++lf[256];
    var _a = hTree(lf, 15), dlt = _a.t, mlb = _a.l;
    var _b = hTree(df, 15), ddt = _b.t, mdb = _b.l;
    var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
    var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
    var lcfreq = new u16(19);
    for (var i = 0; i < lclt.length; ++i)
        ++lcfreq[lclt[i] & 31];
    for (var i = 0; i < lcdt.length; ++i)
        ++lcfreq[lcdt[i] & 31];
    var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
    var nlcc = 19;
    for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
    var flen = (bl + 5) << 3;
    var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
    var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
    if (bs >= 0 && flen <= ftlen && flen <= dtlen)
        return wfblk(out, p, dat.subarray(bs, bs + bl));
    var lm, ll, dm, dl;
    wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
    if (dtlen < ftlen) {
        lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
        var llm = hMap(lct, mlcb, 0);
        wbits(out, p, nlc - 257);
        wbits(out, p + 5, ndc - 1);
        wbits(out, p + 10, nlcc - 4);
        p += 14;
        for (var i = 0; i < nlcc; ++i)
            wbits(out, p + 3 * i, lct[clim[i]]);
        p += 3 * nlcc;
        var lcts = [lclt, lcdt];
        for (var it = 0; it < 2; ++it) {
            var clct = lcts[it];
            for (var i = 0; i < clct.length; ++i) {
                var len = clct[i] & 31;
                wbits(out, p, llm[len]), p += lct[len];
                if (len > 15)
                    wbits(out, p, (clct[i] >> 5) & 127), p += clct[i] >> 12;
            }
        }
    }
    else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
    }
    for (var i = 0; i < li; ++i) {
        var sym = syms[i];
        if (sym > 255) {
            var len = (sym >> 18) & 31;
            wbits16(out, p, lm[len + 257]), p += ll[len + 257];
            if (len > 7)
                wbits(out, p, (sym >> 23) & 31), p += fleb[len];
            var dst = sym & 31;
            wbits16(out, p, dm[dst]), p += dl[dst];
            if (dst > 3)
                wbits16(out, p, (sym >> 5) & 8191), p += fdeb[dst];
        }
        else {
            wbits16(out, p, lm[sym]), p += ll[sym];
        }
    }
    wbits16(out, p, lm[256]);
    return p + ll[256];
};
// deflate options (nice << 13) | chain
var deo = /*#__PURE__*/ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
// empty
var et = /*#__PURE__*/ new u8(0);
// compresses data into a raw DEFLATE buffer
var dflt = function (dat, lvl, plvl, pre, post, st) {
    var s = st.z || dat.length;
    var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7000)) + post);
    // writing to this writes to the output buffer
    var w = o.subarray(pre, o.length - post);
    var lst = st.l;
    var pos = (st.r || 0) & 7;
    if (lvl) {
        if (pos)
            w[0] = st.r >> 3;
        var opt = deo[lvl - 1];
        var n = opt >> 13, c = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        //    prev 2-byte val map    curr 2-byte val map
        var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = function (i) { return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1; };
        // 24576 is an arbitrary number of maximum symbols per block
        // 424 buffer for last block
        var syms = new i32(25000);
        // length/literal freq   distance freq
        var lf = new u16(288), df = new u16(32);
        //  l/lcnt  exbits  index          l/lind  waitdx          blkpos
        var lc_1 = 0, eb = 0, i = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
        for (; i + 2 < s; ++i) {
            // hash value
            var hv = hsh(i);
            // index mod 32768    previous index mod
            var imod = i & 32767, pimod = head[hv];
            prev[imod] = pimod;
            head[hv] = imod;
            // We always should modify head and prev, but only add symbols if
            // this data is not yet processed ("wait" for wait index)
            if (wi <= i) {
                // bytes remaining
                var rem = s - i;
                if ((lc_1 > 7000 || li > 24576) && (rem > 423 || !lst)) {
                    pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
                    li = lc_1 = eb = 0, bs = i;
                    for (var j = 0; j < 286; ++j)
                        lf[j] = 0;
                    for (var j = 0; j < 30; ++j)
                        df[j] = 0;
                }
                //  len    dist   chain
                var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
                if (rem > 2 && hv == hsh(i - dif)) {
                    var maxn = Math.min(n, rem) - 1;
                    var maxd = Math.min(32767, i);
                    // max possible length
                    // not capped at dif because decompressors implement "rolling" index population
                    var ml = Math.min(258, rem);
                    while (dif <= maxd && --ch_1 && imod != pimod) {
                        if (dat[i + l] == dat[i + l - dif]) {
                            var nl = 0;
                            for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                                ;
                            if (nl > l) {
                                l = nl, d = dif;
                                // break out early when we reach "nice" (we are satisfied enough)
                                if (nl > maxn)
                                    break;
                                // now, find the rarest 2-byte sequence within this
                                // length of literals and search for that instead.
                                // Much faster than just using the start
                                var mmd = Math.min(dif, nl - 2);
                                var md = 0;
                                for (var j = 0; j < mmd; ++j) {
                                    var ti = i - dif + j & 32767;
                                    var pti = prev[ti];
                                    var cd = ti - pti & 32767;
                                    if (cd > md)
                                        md = cd, pimod = ti;
                                }
                            }
                        }
                        // check the previous match
                        imod = pimod, pimod = prev[imod];
                        dif += imod - pimod & 32767;
                    }
                }
                // d will be nonzero only when a match was found
                if (d) {
                    // store both dist and len data in one int32
                    // Make sure this is recognized as a len/dist with 28th bit (2^28)
                    syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d];
                    var lin = revfl[l] & 31, din = revfd[d] & 31;
                    eb += fleb[lin] + fdeb[din];
                    ++lf[257 + lin];
                    ++df[din];
                    wi = i + l;
                    ++lc_1;
                }
                else {
                    syms[li++] = dat[i];
                    ++lf[dat[i]];
                }
            }
        }
        for (i = Math.max(i, wi); i < s; ++i) {
            syms[li++] = dat[i];
            ++lf[dat[i]];
        }
        pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
        if (!lst) {
            st.r = (pos & 7) | w[(pos / 8) | 0] << 3;
            // shft(pos) now 1 less if pos & 7 != 0
            pos -= 7;
            st.h = head, st.p = prev, st.i = i, st.w = wi;
        }
    }
    else {
        for (var i = st.w || 0; i < s + lst; i += 65535) {
            // end
            var e = i + 65535;
            if (e >= s) {
                // write final block
                w[(pos / 8) | 0] = lst;
                e = s;
            }
            pos = wfblk(w, pos + 1, dat.subarray(i, e));
        }
        st.i = s;
    }
    return slc(o, 0, pre + shft(pos) + post);
};
// CRC32 table
var crct = /*#__PURE__*/ (function () {
    var t = new Int32Array(256);
    for (var i = 0; i < 256; ++i) {
        var c = i, k = 9;
        while (--k)
            c = ((c & 1) && -306674912) ^ (c >>> 1);
        t[i] = c;
    }
    return t;
})();
// CRC32
var crc = function () {
    var c = -1;
    return {
        p: function (d) {
            // closures have awful performance
            var cr = c;
            for (var i = 0; i < d.length; ++i)
                cr = crct[(cr & 255) ^ d[i]] ^ (cr >>> 8);
            c = cr;
        },
        d: function () { return ~c; }
    };
};
// deflate with opts
var dopt = function (dat, opt, pre, post, st) {
    if (!st) {
        st = { l: 1 };
        if (opt.dictionary) {
            var dict = opt.dictionary.subarray(-32768);
            var newDat = new u8(dict.length + dat.length);
            newDat.set(dict);
            newDat.set(dat, dict.length);
            dat = newDat;
            st.w = dict.length;
        }
    }
    return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? (st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20) : (12 + opt.mem), pre, post, st);
};
// write bytes
var wbytes = function (d, b, v) {
    for (; v; ++b)
        d[b] = v, v >>>= 8;
};
// gzip header
var gzh = function (c, o) {
    var fn = o.filename;
    c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3; // assume Unix
    if (o.mtime != 0)
        wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1000));
    if (fn) {
        c[3] = 8;
        for (var i = 0; i <= fn.length; ++i)
            c[i + 10] = fn.charCodeAt(i);
    }
};
// gzip footer: -8 to -4 = CRC, -4 to -0 is length
// gzip start
var gzs = function (d) {
    if (d[0] != 31 || d[1] != 139 || d[2] != 8)
        err(6, 'invalid gzip data');
    var flg = d[3];
    var st = 10;
    if (flg & 4)
        st += (d[10] | d[11] << 8) + 2;
    for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
        ;
    return st + (flg & 2);
};
// gzip length
var gzl = function (d) {
    var l = d.length;
    return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
};
// gzip header length
var gzhl = function (o) { return 10 + (o.filename ? o.filename.length + 1 : 0); };
// zlib start
var zls = function (d, dict) {
    if ((d[0] & 15) != 8 || (d[0] >> 4) > 7 || ((d[0] << 8 | d[1]) % 31))
        err(6, 'invalid zlib data');
    if ((d[1] >> 5 & 1) == +!dict)
        err(6, 'invalid zlib data: ' + (d[1] & 32 ? 'need' : 'unexpected') + ' dictionary');
    return (d[1] >> 3 & 4) + 2;
};
/**
 * Expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param opts The decompression options
 * @returns The decompressed version of the data
 */
function inflateSync(data, opts) {
    return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */
function gzipSync(data, opts) {
    if (!opts)
        opts = {};
    var c = crc(), l = data.length;
    c.p(data);
    var d = dopt(data, opts, gzhl(opts), 8), s = d.length;
    return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}
/**
 * Expands GZIP data
 * @param data The data to decompress
 * @param opts The decompression options
 * @returns The decompressed version of the data
 */
function gunzipSync(data, opts) {
    var st = gzs(data);
    if (st + 8 > data.length)
        err(6, 'invalid gzip data');
    return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
/**
 * Expands Zlib data
 * @param data The data to decompress
 * @param opts The decompression options
 * @returns The decompressed version of the data
 */
function unzlibSync(data, opts) {
    return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param opts The decompression options
 * @returns The decompressed version of the data
 */
function decompressSync(data, opts) {
    return (data[0] == 31 && data[1] == 139 && data[2] == 8)
        ? gunzipSync(data, opts)
        : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
            ? inflateSync(data, opts)
            : unzlibSync(data, opts);
}
// text encoder
var te = typeof TextEncoder != 'undefined' && /*#__PURE__*/ new TextEncoder();
// text decoder
var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder();
// text decoder stream
var tds = 0;
try {
    td.decode(et, { stream: true });
    tds = 1;
}
catch (e) { }
// decode UTF8
var dutf8 = function (d) {
    for (var r = '', i = 0;;) {
        var c = d[i++];
        var eb = (c > 127) + (c > 223) + (c > 239);
        if (i + eb > d.length)
            return { s: r, r: slc(d, i - 1) };
        if (!eb)
            r += String.fromCharCode(c);
        else if (eb == 3) {
            c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63)) - 65536,
                r += String.fromCharCode(55296 | (c >> 10), 56320 | (c & 1023));
        }
        else if (eb & 1)
            r += String.fromCharCode((c & 31) << 6 | (d[i++] & 63));
        else
            r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | (d[i++] & 63));
    }
};
/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */
function strToU8(str, latin1) {
    if (latin1) {
        var ar_1 = new u8(str.length);
        for (var i = 0; i < str.length; ++i)
            ar_1[i] = str.charCodeAt(i);
        return ar_1;
    }
    if (te)
        return te.encode(str);
    var l = str.length;
    var ar = new u8(str.length + (str.length >> 1));
    var ai = 0;
    var w = function (v) { ar[ai++] = v; };
    for (var i = 0; i < l; ++i) {
        if (ai + 5 > ar.length) {
            var n = new u8(ai + 8 + ((l - i) << 1));
            n.set(ar);
            ar = n;
        }
        var c = str.charCodeAt(i);
        if (c < 128 || latin1)
            w(c);
        else if (c < 2048)
            w(192 | (c >> 6)), w(128 | (c & 63));
        else if (c > 55295 && c < 57344)
            c = 65536 + (c & 1023 << 10) | (str.charCodeAt(++i) & 1023),
                w(240 | (c >> 18)), w(128 | ((c >> 12) & 63)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
        else
            w(224 | (c >> 12)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63));
    }
    return slc(ar, 0, ai);
}
/**
 * Converts a Uint8Array to a string
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */
function strFromU8(dat, latin1) {
    if (latin1) {
        var r = '';
        for (var i = 0; i < dat.length; i += 16384)
            r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
        return r;
    }
    else if (td) {
        return td.decode(dat);
    }
    else {
        var _a = dutf8(dat), s = _a.s, r = _a.r;
        if (r.length)
            err(8);
        return s;
    }
}

function generateDataAttributeValue(filePath, lineStart, lineEnd, lineClosing, root, absolute = false) {
    // Convert the absolute path to a path relative to the project root
    const relativeFilePath = absolute ? filePath : pathLib.relative(root || process.cwd(), filePath);
    return `${relativeFilePath}:${lineStart}:${lineEnd}:${lineClosing}`;
}

function getCurrentCommit$1() {
    try {
        if (typeof window === 'undefined') {
            const stdout = execSync('git rev-parse HEAD');
            return stdout.toString().trim();
        } else {
            throw 'child_process is not available in the browser.';
        }
    } catch (err) {
        console.error(err);
        // Not a git repository or some other error occurred
        return null;
    }
}

function compress$1(json) {
    // Compress JSON to base64
    const buf = strToU8(JSON.stringify(json));
    const compressed = gzipSync(buf);
    let base64;
    // Check if running in a browser
    if (typeof window !== 'undefined' && window.btoa) {
        // Use browser's method to convert binary data to a string and then encode to base64
        const binaryString = Array.from(new Uint8Array(compressed)).map(byte => String.fromCharCode(byte)).join('');
        base64 = btoa(binaryString);
    } else {
        base64 = Buffer.from(compressed).toString('base64');
    }
    return base64;
}

function decompress(base64) {
    // Decompress base64 to JSON
    let buffer;
    if (typeof window !== 'undefined' && window.atob) {
        buffer = new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)));
    } else {
        buffer = Buffer.from(base64, 'base64');
    }
    const decompressed = decompressSync(buffer);
    const str = strFromU8(decompressed);
    return JSON.parse(str);
}

// Note: line and columns are 1-index extraction is 0-index
function extractTagContent(content, tagPosition) {
    const lines = content.split('\n');

    // Extract content for the given tag position from start line column to end line column
    if (tagPosition) {
        const { start, end } = tagPosition;
        if (!start || !end) return null;

        if (start.line === end.line) {
            // Tag content is within a single line
            return lines[start.line - 1].substring(start.column - 1, end.column - 1);
        } else {
            // Tag content spans multiple lines
            let extractedContent = [];

            // Add the part of the start line after the start column
            extractedContent.push(lines[start.line - 1].substring(start.column - 1));

            // Add all lines in between
            for (let i = start.line; i < end.line - 1; i++) {
                extractedContent.push(lines[i]);
            }

            // Add the part of the end line before the end column
            extractedContent.push(lines[end.line - 1].substring(0, end.column - 1));
            return extractedContent.join('\n');
        }
    }
    return null;
}

// For testing tags by printing start and end tag based on information
function testTags(filename, startTag, endTag) {
    const content = fs.readFileSync(filename, 'utf8');

    const startTagContent = extractTagContent(content, startTag);
    console.log("S:", "'" + startTagContent + "'");

    // Check if there is an end tag and extract its content if present
    if (endTag) {
        const endTagContent = extractTagContent(content, endTag);
        console.log("E:", "'" + endTagContent + "'");
    } else {
        console.log("E:", "null");
    }
}

function getTemplateContent(content, templateNode) {
    const { startTag, endTag } = templateNode;
    const startTagContent = extractTagContent(content, startTag);
    let childrenContent = null;
    let endTagContent = null;

    if (endTag) {
        endTagContent = extractTagContent(content, endTag);
        const childrenPos = {
            start: startTag.end,
            end: endTag.start
        };
        childrenContent = extractTagContent(content, childrenPos);
    }
    return {
        startTagContent,
        childrenContent,
        endTagContent
    }
}

var helpers = /*#__PURE__*/Object.freeze({
	__proto__: null,
	compress: compress$1,
	decompress: decompress,
	extractTagContent: extractTagContent,
	generateDataAttributeValue: generateDataAttributeValue,
	getCurrentCommit: getCurrentCommit$1,
	getTemplateContent: getTemplateContent,
	testTags: testTags
});

const DATA_ONLOOK_ID$1 = "data-onlook-id";

var constants = /*#__PURE__*/Object.freeze({
	__proto__: null,
	DATA_ONLOOK_ID: DATA_ONLOOK_ID$1
});

const { getCurrentCommit, compress } = helpers;
const { DATA_ONLOOK_ID } = constants;


var reactBabel = function babelPluginOnlook({ root = process.cwd(), absolute = false }) {
  const commit = getCurrentCommit();
  return {
    visitor: {
      JSXElement(path, state) {
        const filename = state.file.opts.filename;
        const nodeModulesPath = `${root}/node_modules`;

        // Ignore node_modules
        if (filename.startsWith(nodeModulesPath)) {
          return;
        }

        // Ensure `loc` exists before accessing its properties
        if (!path.node.openingElement.loc || !path.node.openingElement.loc.start || !path.node.openingElement.loc.end) {
          return;
        }

        const attributeValue = getDataOnlookId(path, filename, commit, root, absolute);

        // Create the custom attribute
        const onlookAttribute = lib.jSXAttribute(
          lib.jSXIdentifier(DATA_ONLOOK_ID),
          lib.stringLiteral(attributeValue)
        );

        // Append the attribute to the element
        path.node.openingElement.attributes.push(onlookAttribute);
      }
    },
  };
};


function getDataOnlookId(path, filename, commit, root, absolute) {
  const startTag = {
    start: {
      line: path.node.openingElement.loc.start.line,
      column: path.node.openingElement.loc.start.column + 1
    },
    end: {
      line: path.node.openingElement.loc.end.line,
      column: path.node.openingElement.loc.end.column + 1
    }
  };
  const endTag = path.node.closingElement ? {
    start: {
      line: path.node.closingElement.loc.start.line,
      column: path.node.closingElement.loc.start.column + 1
    },
    end: {
      line: path.node.closingElement.loc.end.line,
      column: path.node.closingElement.loc.end.column + 1
    }
  } : null;

  const domNode = {
    path: absolute ? filename : pathLib.relative(root, filename),
    startTag,
    endTag,
    commit
  };

  return compress(domNode);
}

export { reactBabel as default };
